import { useWeb3React } from '@web3-react/core';
import { openWalletModal } from 'redux/user/user';
import { useDispatch } from 'react-redux';
import BigNumber from 'bignumber.js';

interface Props {
  onStart: Function;
  amount: string;
  errorMsg: string;
}

export const AddLiquiditySingleCTA = ({ onStart, amount, errorMsg }: Props) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();

  const button = () => {
    const hasAmount = new BigNumber(amount).gt(0);
    if (!account && hasAmount) {
      return {
        label: 'Connect your wallet',
        disabled: false,
        variant: 'btn-primary',
      };
    }

    if (errorMsg) {
      return { label: errorMsg, disabled: true, variant: 'btn-error' };
    }

    if (!hasAmount) {
      return { label: 'Enter amount', disabled: true, variant: 'btn-primary' };
    } else {
      return {
        label: 'Trade',
        disabled: false,
        variant: 'btn-primary',
      };
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
    <button
      onClick={() => onClick()}
      disabled={button().disabled}
      className={`${button().variant} rounded w-full`}
    >
      {button().label}
    </button>
  );
};
