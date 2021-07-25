import { bancorNetwork$ } from 'services/observables/contracts';
import { TokenListItem } from 'services/observables/tokens';
import { EthNetworks } from 'services/web3/types';
import { expandToken, shrinkToken, splitArrayByVal } from 'utils/pureFunctions';
import { resolveTxOnConfirmation } from 'services/web3';
import { web3, writeWeb3 } from 'services/web3/contracts';
import {
  bntToken,
  ethToken,
  wethToken,
  zeroAddress,
} from 'services/web3/config';
import {
  buildNetworkContract,
  conversionPath,
  getRateByPath,
} from 'services/web3/contracts/network/wrapper';
import { take } from 'rxjs/operators';
import BigNumber from 'bignumber.js';
import { apiData$ } from 'services/observables/pools';
import { Pool } from 'services/api/bancor';
import { currentNetwork$ } from 'services/observables/network';

export const getRateAndPriceImapct = async (
  fromToken: TokenListItem,
  toToken: TokenListItem,
  amount: string
) => {
  const networkContractAddress = await bancorNetwork$.pipe(take(1)).toPromise();

  const path = await conversionPath({
    from: fromToken.address === wethToken ? ethToken : fromToken.address,
    to: toToken.address === wethToken ? ethToken : toToken.address,
    networkContractAddress,
    web3,
  });

  const fromAmountWei = expandToken(amount, fromToken.decimals);
  const toAmountWei = await getRateByPath({
    networkContractAddress,
    amount: fromAmountWei,
    path,
    web3,
  });

  const rate = shrinkToken(toAmountWei, toToken.decimals);
  const priceImpact = new BigNumber(rate)
    .div(await calculateSpotPrice(fromToken.address, toToken.address))
    .toFixed(4);

  return {
    rate,
    priceImpact,
  };
};

export const swap = async ({
  net,
  slippageTolerance,
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  user,
  onConfirmation,
}: {
  net: EthNetworks;
  slippageTolerance: number;
  fromToken: TokenListItem;
  toToken: TokenListItem;
  fromAmount: string;
  toAmount: string;
  user: string;
  onConfirmation: Function;
}): Promise<string> => {
  const fromIsEth = fromToken.address === ethToken;
  const networkContractAddress = await bancorNetwork$.pipe(take(1)).toPromise();

  const networkContract = buildNetworkContract(
    networkContractAddress,
    writeWeb3
  );

  const fromWei = expandToken(fromAmount, fromToken.decimals);
  const expectedToWei = expandToken(toAmount, toToken.decimals);

  const path = await findPath(fromToken.address, toToken.address);

  //handle ETH in path

  return resolveTxOnConfirmation({
    tx: networkContract.methods.convertByPath(
      path,
      fromWei,
      new BigNumber(expectedToWei)
        .times(new BigNumber(1).minus(slippageTolerance))
        .toFixed(0),
      zeroAddress,
      zeroAddress,
      0
    ),
    user,
    onConfirmation: () => {
      onConfirmation();
    },
    resolveImmediately: true,
    ...(fromIsEth && { value: fromWei }),
  });
};

const findPath = async (from: string, to: string) => {
  const network = await currentNetwork$.pipe(take(1)).toPromise();
  if (from === bntToken(network))
    return [from, (await findPoolByToken(to)).converter_dlt_id, to];

  if (to === bntToken(network))
    return [from, (await findPoolByToken(from)).converter_dlt_id, to];

  return [
    from,
    (await findPoolByToken(from)).converter_dlt_id,
    bntToken(network),
    (await findPoolByToken(to)).converter_dlt_id,
    to,
  ];
};

const calculateSpotPrice = async (from: string, to: string) => {
  const network = await currentNetwork$.pipe(take(1)).toPromise();

  let pool;
  if (from === bntToken(network)) pool = await findPoolByToken(to);
  if (to === bntToken(network)) pool = await findPoolByToken(from);

  if (pool) {
    const [fromReserve, toReserve] = splitArrayByVal(
      pool.reserves,
      (x) => x.address === from
    );
    return new BigNumber(toReserve[0].balance).div(
      new BigNumber(fromReserve[0].balance).times(
        new BigNumber(1).minus(pool.fee)
      )
    );
  }

  //First hop
  const fromPool = await findPoolByToken(from);
  const [fromReserve1, toReserve1] = splitArrayByVal(
    fromPool.reserves,
    (x) => x.address === from
  );

  //Second hop
  const toPool = await findPoolByToken(to);
  const [fromReserve2, toReserve2] = splitArrayByVal(
    toPool.reserves,
    (x) => x.address !== to
  );

  return new BigNumber(toReserve1[0].balance).div(
    new BigNumber(fromReserve1[0].balance)
      .times(new BigNumber(1).minus(fromPool.fee))
      .times(
        new BigNumber(toReserve2[0].balance).div(
          new BigNumber(fromReserve2[0].balance).times(
            new BigNumber(1).minus(toPool.fee)
          )
        )
      )
  );
};

const findPoolByToken = async (tkn: string): Promise<Pool> => {
  const apiData = await apiData$.pipe(take(1)).toPromise();

  const pool = apiData.pools.find(
    (x) => x && x.reserves.find((x) => x.address === tkn)
  );
  if (pool) return pool;

  throw new Error('No pool found');
};
