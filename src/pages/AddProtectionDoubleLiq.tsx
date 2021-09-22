import { TokenInputField } from 'components/tokenInputField/TokenInputField';
import { ModalApprove } from 'elements/modalApprove/modalApprove';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { useAppSelector } from 'redux/index';
import { Pool, Token } from 'services/observables/tokens';
import { isAddress } from 'web3-utils';
import { SwapSwitch } from 'elements/swapSwitch/SwapSwitch';
import { ReactComponent as IconTimes } from 'assets/icons/times.svg';
import { prettifyNumber } from 'utils/helperFunctions';
import {
  fetchPoolReserveBalances,
  getTokenContractApproval,
} from 'services/web3/contracts/converter/wrapper';
import { partitionPair, wait } from 'utils/pureFunctions';
import { BigNumber } from 'bignumber.js';
import { useInterval } from 'hooks/useInterval';
import { getNetworkContractApproval } from 'services/web3/approval';
import { ErrorCode, TokenAndAmount } from 'services/web3/types';
import {
  addNotification,
  NotificationType,
} from 'redux/notification/notification';
import { useApprove } from 'hooks/useApprove';
import { first } from 'rxjs/operators';
import { addLiquidity as addLiquidityTx } from 'services/web3/contracts/converter/wrapper';
import { onLogin$ } from 'services/observables/user';


interface Props {
  anchor: string;
}

export const AddProtectionDoubleLiq = (
  { anchor }: Props
  ) => {

  const isValidAnchor = isAddress(anchor);

  const [amountBnt, setAmountBnt] = useState('');
  const [amountTkn, setAmountTkn] = useState('');

  const [amountBntUsd, setAmountBntUsd] = useState('');
  const [amountTknUsd, setAmountTknUsd] = useState('');

  const pools = useAppSelector((state) => state.bancor.pools as Pool[]);
  const tokens = useAppSelector((state) => state.bancor.tokens as Token[]);
  const account = useAppSelector(
    (state) => state.bancor.user as string | undefined
  );

  const [selectedPool, setPool] = useState(
    pools.find(
      (pool) => pool.pool_dlt_id.toLowerCase() === anchor.toLowerCase()
    )
  );
  useEffect(() => {
    setPool(pools.find((pool) => pool.pool_dlt_id === anchor));
  }, [pools, anchor]);

  const bntToken =
    (tokens &&
      tokens.length > 0 &&
      tokens.find((token) => token.symbol === 'BNT')) ||
    false;

  const tknTokenAddress =
    bntToken &&
    selectedPool?.reserves.find(
      (reserve) => reserve.address !== bntToken.address
    )?.address;

  const tknToken =
    (bntToken &&
      tknTokenAddress &&
      tokens.find((token) => token.address === tknTokenAddress)) ||
    false;

  const dispatch = useDispatch();

  const [bntToTknRate, setBntToTknRate] = useState('');
  const [tknToBntRate, setTknToBntRate] = useState('');

  const onBntChange = (value: string) => {
    setAmountBnt(value);
    if (tknToken) {
      const amountTkn = new BigNumber(value).times(bntToTknRate);

      setAmountTkn(
        amountTkn.toFormat(tknToken.decimals, BigNumber.ROUND_UP, {
          groupSeparator: '',
          decimalSeparator: '.',
        })
      );
      setAmountTknUsd(amountTkn.times(tknToken.usdPrice!).toString());
    }
  };

  const [beOpen, setBeOpen] = useState(false);
  // useInterval(() => {
  //   setBeOpen((state) => !state);
  // }, 1000);

  const onTknChange = (value: string) => {
    setAmountTkn(value);
    if (bntToken) {
      const amountBnt = new BigNumber(value).times(tknToBntRate);
      setAmountBnt(
        amountBnt.toFormat(bntToken.decimals, BigNumber.ROUND_UP, {
          groupSeparator: '',
          decimalSeparator: '.',
        })
      );
      setAmountBntUsd(amountBnt.times(bntToken.usdPrice!).toString());
    }
  };

  const fetchPoolRates = async () => {
    if (selectedPool && bntToken) {
      const poolBalances = await fetchPoolReserveBalances(selectedPool);
      const [bntReserve, tknReserve] = partitionPair(
        poolBalances,
        (balance) => balance.contract === bntToken.address
      ).map((reserve) => reserve.weiAmount);
      setBntToTknRate(new BigNumber(tknReserve).div(bntReserve).toString());
      setTknToBntRate(new BigNumber(bntReserve).div(tknReserve).toString());
    }
  };

  useEffect(() => {
    fetchPoolRates();
  }, [selectedPool]);

  useInterval(
    () => {
      fetchPoolRates();
    },
    60000,
    false
  );

  const isLoading = useAppSelector((state) => state.bancor.pools.length === 0);

  useEffect(() => {
    setPool(pools.find((pool) => pool.pool_dlt_id === anchor));
  }, [pools, anchor]);

  const [
    triggerCheck,
    isOpen,
    selectedToken,
    selectedAmount,
    waitForConfirmation,
    handleApproved,
    handleOpen,
  ] = useApprove(
    [
      { amount: amountBnt, token: bntToken as Token },
      { amount: amountTkn, token: tknToken as Token },
    ],
    selectedPool?.converter_dlt_id || '',
    true,
    () => {
      addLiquidity();
    }
  );

  if (!isValidAnchor) return <div>Invalid Anchor!</div>;

  const addLiquidity = async () => {
    const tokenLabel = `${amountBnt} ${
      (bntToken! as Token).symbol
    } & ${amountTkn} ${(tknToken! as Token).symbol}`;

    const amounts = [
      { decAmount: amountBnt, token: bntToken as Token },
      { decAmount: amountTkn, token: tknToken as Token },
    ];

    try {
      const txHash = await addLiquidityTx(
        amounts,
        selectedPool!.converter_dlt_id
      );

      dispatch(
        addNotification({
          type: NotificationType.pending,
          title: 'Pending Confirmation',
          msg: `Adding ${tokenLabel} is Pending Confirmation`,
          updatedInfo: {
            successTitle: 'Success!',
            successMsg: `Adding ${tokenLabel} to the pool has been confirmed`,
            errorTitle: 'Transaction Failed',
            errorMsg: `Adding ${tokenLabel} has failed. Please try again or contact support`,
          },
          txHash,
        })
      );
    } catch (e) {
      if (e.code === ErrorCode.DeniedTx) {
        dispatch(
          addNotification({
            type: NotificationType.error,
            title: 'Transaction Rejected',
            msg: 'You rejected the trade. If this was by mistake, please try again.',
          })
        );
      } else {
        console.error(e);
        dispatch(
          addNotification({
            type: NotificationType.error,
            title: 'Transaction Failed',
            msg: `Failed to add ${tokenLabel} ${e.message}`,
          })
        );
      }
    }
  };

  if (
    isLoading ||
    typeof selectedPool === 'undefined' ||
    !tokens ||
    tokens.length === 0
  ) {
    return <div>Loading...</div>;
  }

  return (
    (
      <div className="mx-auto widget">
        <ModalApprove
          title="Add Liquidity"
          isOpen={isOpen}
          promptSelected={handleOpen}
          amount={selectedAmount}
          fromToken={selectedToken}
          handleApproved={(address: string) => handleApproved(address)}
          waitForApproval={waitForConfirmation}
        />
        <div className="flex justify-between p-14">
          <SwapSwitch />
          <div className="text-center">
            <h1 className="font-bold">Add Liquidity</h1>
          </div>

          <button
            onClick={() => {}}
            className="px-5 py-2 rounded-10 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <IconTimes className="w-14" />
          </button>
        </div>
        <hr className="widget-separator" />

        <div className="px-20 mt-6 mb-10 font-medium text-blue-4">
          Enter Stake Amount
        </div>

        <div className="px-10">
          <div className="px-4">
            <div className="mb-12">
              <TokenInputField
                label=" "
                setInput={onBntChange}
                selectable={false}
                input={amountBnt}
                token={bntToken! as Token}
                border
                amountUsd={amountBntUsd}
                setAmountUsd={setAmountBntUsd}
              />
            </div>

            <TokenInputField
              label=" "
              setInput={onTknChange}
              selectable={false}
              input={amountTkn}
              border
              token={tknToken! as Token}
              amountUsd={amountTknUsd}
              setAmountUsd={setAmountTknUsd}
            />
          </div>

          <div className="px-20 mt-12 mb-10 leading-7 rounded rounded-lg text-16 bg-blue-0 dark:bg-blue-5 dark:text-grey-0 text-blue-4 py-18">
            <div className="font-medium">Token prices</div>
            <div className="p-10 mt-8">
              <div className="flex justify-between">
                <div className="text-20">1 BNT =</div>
                <div className="text-right text-grey-4">
                  ~
                  {bntToken &&
                    bntToken.usdPrice &&
                    prettifyNumber(bntToken.usdPrice, true)}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-20">1 {tknToken && tknToken.symbol} =</div>
                <div className="text-right text-grey-4">
                  ~
                  {tknToken &&
                    tknToken.usdPrice &&
                    prettifyNumber(tknToken.usdPrice, true)}
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-4 text-blue-4 opacity-70">
              <div>
                1 BNT (
                {bntToken &&
                  bntToken.usdPrice &&
                  prettifyNumber(bntToken.usdPrice, true)}
                ) =
              </div>
              <div>0.00 ETH ($0.00)</div>
            </div>
            <div className="mt-12 mb-20 leading-3 text-14">
              I understand that I am adding dual sided liquidity to the pool{' '}
            </div>
            <button
              onClick={() => {
                triggerCheck();
              }}
              className={`btn-primary rounded w-full`}
              disabled={false}
            >
              Supply
            </button>
          </div>
        </div>
      </div>
    ) || <div>Invalid anchor!</div>
  );
};