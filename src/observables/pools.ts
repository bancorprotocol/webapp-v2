import { getWelcomeData, Pool, Swap, WelcomeData } from 'api/bancor';
import { isEqual, uniqBy, uniqWith, zip } from 'lodash';
import { combineLatest, of, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  pluck,
  share,
  shareReplay,
  startWith,
  withLatestFrom,
} from 'rxjs/operators';
import { ConverterAndAnchor } from 'web3/types';
import { bancorConverterRegistry$ } from './contracts';
import { switchMapIgnoreThrow } from './customOperators';
import { supportedNetworkVersion$ } from './network';
import { fifteenSeconds$ } from './timers';
import {
  getAnchors,
  getConvertersByAnchors,
} from 'web3/contracts/converterRegistry/wrapper';
import { web3 } from 'web3/contracts';
import { toChecksumAddress } from 'web3-utils';
import { updateArray } from 'helpers';
import { setTokens } from 'redux/bancorAPI/bancorAPI';
import { balance } from './balances';

const zipAnchorAndConverters = (
  anchorAddresses: string[],
  converterAddresses: string[]
): ConverterAndAnchor[] => {
  if (anchorAddresses.length !== converterAddresses.length)
    throw new Error(
      'was expecting as many anchor addresses as converter addresses'
    );

  const zipped = zip(anchorAddresses, converterAddresses) as [string, string][];
  return zipped.map(([anchorAddress, converterAddress]) => ({
    anchorAddress: toChecksumAddress(anchorAddress!),
    converterAddress: toChecksumAddress(converterAddress!),
  }));
};

export const apiData$ = combineLatest([
  supportedNetworkVersion$,
  fifteenSeconds$,
]).pipe(
  switchMapIgnoreThrow(([networkVersion]) => getWelcomeData(networkVersion)),
  distinctUntilChanged<WelcomeData>(isEqual),
  share()
);

const trueAnchors$ = bancorConverterRegistry$.pipe(
  switchMapIgnoreThrow((converterRegistry) =>
    getAnchors(converterRegistry, web3)
  ),
  shareReplay(1)
);

const anchorAndConverters$ = combineLatest([
  trueAnchors$,
  bancorConverterRegistry$,
]).pipe(
  switchMapIgnoreThrow(async ([anchorAddresses, converterRegistryAddress]) => {
    const converters = await getConvertersByAnchors({
      anchorAddresses,
      converterRegistryAddress,
      web3,
    });
    const anchorsAndConverters = zipAnchorAndConverters(
      anchorAddresses,
      converters
    );
    return anchorsAndConverters;
  }),
  startWith([]),
  shareReplay<ConverterAndAnchor[]>(1)
);

const apiPools$ = apiData$.pipe(
  pluck('pools'),
  distinctUntilChanged<WelcomeData['pools']>(isEqual),
  shareReplay(1)
);

export const pools$ = combineLatest([apiPools$, anchorAndConverters$]).pipe(
  map(([pools, anchorAndConverters]) => {
    if (anchorAndConverters.length === 0) return pools;
    return updateArray(
      pools,
      (pool) => {
        const correctAnchor = anchorAndConverters.find(
          (anchor) => anchor.anchorAddress === pool.pool_dlt_id
        );
        if (!correctAnchor) return false;
        return correctAnchor.converterAddress !== pool.converter_dlt_id;
      },
      (pool) => {
        const correctAnchor = anchorAndConverters.find(
          (anchor) => anchor.anchorAddress === pool.pool_dlt_id
        )!;
        return {
          ...pool,
          converter_dlt_id: correctAnchor.converterAddress,
        };
      }
    );
  }),
  distinctUntilChanged<WelcomeData['pools']>(isEqual),
  shareReplay(1)
);

export const apiTokens$ = apiData$.pipe(
  pluck('tokens'),
  distinctUntilChanged<WelcomeData['tokens']>(isEqual),
  shareReplay()
);

export const trigger = () => {
  apiTokens$.subscribe((tokens) => {
    console.log(tokens, 'are the tokens');
    setTokens(tokens);
    balance.fetchBalances(['0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C']);
  });
};

interface SwapOptions {
  fromId: string;
  toId: string;
  decAmount: string;
}

interface MinimalPool {
  anchorAddress: string;
  contract: string;
  reserves: string[];
}

const toMinimal = (pool: Pool): MinimalPool => ({
  anchorAddress: pool.pool_dlt_id,
  contract: pool.converter_dlt_id,
  reserves: pool.reserves.map((reserve) => reserve.address),
});

const swapReceiver$ = new Subject<SwapOptions>();

const sortByLiqDepth = (a: Pool, b: Pool) =>
  Number(b.liquidity.usd) - Number(a.liquidity.usd);

const dropDuplicateReservesByHigherLiquidity = (pools: Pool[]) => {
  const sortedByLiquidityDepth = pools.sort(sortByLiqDepth);
  const uniquePools = uniqBy(sortedByLiquidityDepth, 'pool_dlt_id');

  return uniquePools;
};

const poolHasBalances = (pool: Pool) =>
  pool.reserves.every((reserve) => reserve.balance !== '0');

const filterTradeWorthyPools = (pools: Pool[]) => {
  const poolsWithBalances = pools.filter(poolHasBalances);
  const removedDuplicates =
    dropDuplicateReservesByHigherLiquidity(poolsWithBalances);
  return removedDuplicates;
};

const findPath = (from: string, to: string, pools: MinimalPool[]) => {
  const singlePool = pools.find((pool) =>
    [from, to].every((tradedToken) =>
      pool.reserves.some((reserve) => tradedToken === reserve)
    )
  );
  if (singlePool) {
    return singlePool;
  }

  const validStartingPools = pools.filter((relay) =>
    relay.reserves.some((reserve) => reserve === from)
  );
  const validTerminatingPools = pools.filter((relay) =>
    relay.reserves.some((reserve) => reserve === to)
  );
  const areSufficientPools =
    validStartingPools.length > 0 && validTerminatingPools.length > 0;

  if (!areSufficientPools)
    throw new Error(`No pools found containing both the from and to target`);

  const moreThanOneStartingPool = validStartingPools.length > 1;
  if (moreThanOneStartingPool) {
  } else {
  }
  const onlyPoolNeeded = [];
};

const swapTx$ = swapReceiver$.pipe(
  withLatestFrom(pools$),
  map(([options, pools]) => {
    const winningPools = filterTradeWorthyPools(pools);
    const minimalPools = winningPools.map(toMinimal);
  })
);

export const tx = {
  swap: function (fromId: string, toId: string, decAmount: string) {
    swapReceiver$.next({ fromId, toId, decAmount });
  },
};
