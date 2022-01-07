import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { openWalletModal } from 'redux/user/user';
import { useApproveModal } from 'hooks/useApproveModal';
import { Pool, Token } from 'services/observables/tokens';
import { addLiquidity } from 'services/web3/liquidity/liquidity';
import {
  addLiquidityFailedNotification,
  addLiquidityNotification,
  rejectNotification,
} from 'services/notifications/notifications';
import { prettifyNumber } from 'utils/helperFunctions';
import { useCallback } from 'react';
import { useNavigation } from 'services/router';
import {
  LiquidityEvents,
  sendLiquidityEvent,
} from 'services/api/googleTagManager';
import { EthNetworks } from 'services/web3/types';
import BigNumber from 'bignumber.js';
import { useAppSelector } from 'redux/index';

interface Props {
  pool: Pool;
  bnt: Token;
  tkn: Token;
  amountBnt: string;
  amountTkn: string;
  errorMsg?: string;
}

export const AddLiquidityEmptyCTA = ({
  pool,
  bnt,
  tkn,
  amountBnt,
  amountTkn,
  errorMsg,
}: Props) => {
  const dispatch = useDispatch();
  const { account, chainId } = useWeb3React();
  const { pushPortfolio } = useNavigation();
  const fiatToggle = useAppSelector<boolean>((state) => state.user.usdToggle);

  const handleAddLiquidity = useCallback(async () => {
    const cleanTkn = prettifyNumber(amountTkn);
    const cleanBnt = prettifyNumber(amountBnt);
    const gtmEvent = {
      liquidity_type: 'Add Liquidity',
      liquidity_blockchain_network:
        chainId === EthNetworks.Ropsten ? 'Ropsten' : 'MainNet',
      liquidity_poolName: pool.name,
      liquidity_tkn_symbol: tkn.symbol,
      liquidity_tkn_amount: amountTkn,
      liquidity_tkn_amount_usd: new BigNumber(amountTkn)
        .times(tkn.usdPrice || 0)
        .toString(),
      liquidity_bnt_symbol: bnt.symbol,
      liquidity_bnt_amount: amountBnt,
      liquidity_bnt_amount_usd: new BigNumber(amountBnt)
        .times(bnt.usdPrice || 0)
        .toString(),
      liquidity_input_type: fiatToggle ? 'Fiat' : 'Token',
    };
    sendLiquidityEvent(LiquidityEvents.click, 'Add', gtmEvent);
    await addLiquidity(
      amountBnt,
      bnt,
      amountTkn,
      tkn,
      pool.converter_dlt_id,
      (txHash: string) =>
        addLiquidityNotification(
          dispatch,
          txHash,
          cleanTkn,
          tkn.symbol,
          cleanBnt,
          bnt.symbol,
          pool.name
        ),
      () => {
        sendLiquidityEvent(LiquidityEvents.success, 'Add', gtmEvent);
        if (window.location.pathname.includes(pool.pool_dlt_id))
          pushPortfolio();
      },
      () => {
        sendLiquidityEvent(LiquidityEvents.fail, 'Add', {
          ...gtmEvent,
          error: 'Transaction rejected by user',
        });
        rejectNotification(dispatch);
      },
      (msg) => {
        sendLiquidityEvent(LiquidityEvents.fail, 'Add', {
          ...gtmEvent,
          error: msg,
        });
        addLiquidityFailedNotification(
          dispatch,
          cleanTkn,
          tkn.symbol,
          cleanBnt,
          bnt.symbol,
          pool.name
        );
      }
    );
  }, [
    amountTkn,
    amountBnt,
    chainId,
    pool.name,
    pool.converter_dlt_id,
    pool.pool_dlt_id,
    tkn,
    bnt,
    fiatToggle,
    dispatch,
    pushPortfolio,
  ]);

  const [onStart, ModalApprove] = useApproveModal(
    [
      { amount: amountBnt, token: bnt },
      { amount: amountTkn, token: tkn },
    ],
    handleAddLiquidity,
    pool.converter_dlt_id
  );

  const button = () => {
    if (errorMsg) {
      return { label: errorMsg, disabled: true, variant: 'btn-error' };
    }
    if (!amountBnt || !amountTkn) {
      return {
        label: 'Enter amount',
        disabled: true,
        variant: 'btn-primary',
      };
    } else {
      return { label: 'Supply', disabled: false, variant: 'btn-primary' };
    }
  };

  const onClick = () => {
    if (!account) {
      dispatch(openWalletModal(true));
    } else {
      onStart();
    }
  };

  return (
    <>
      <button
        onClick={() => onClick()}
        disabled={button().disabled}
        className={`${button().variant} rounded w-full mt-20`}
      >
        {button().label}
      </button>
      {ModalApprove}
    </>
  );
};
