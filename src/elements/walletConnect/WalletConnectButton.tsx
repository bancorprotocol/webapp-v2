import { UseWalletConnect } from './useWalletConnect';
import { shortenString } from 'utils/pureFunctions';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';
import useENS from 'hooks/useENS';
import Davatar from '@davatar/react';

export const WalletConnectButton = ({
  handleWalletButtonClick,
  account,
  selectedWallet,
}: UseWalletConnect) => {
  const { ensName } = useENS(account || '');
  const buttonText = account
    ? ensName || shortenString(account)
    : 'Connect Wallet';

  return (
    <button
      className="flex items-center md:btn-outline-secondary md:btn-sm md:mr-40"
      onClick={() => handleWalletButtonClick()}
    >
      {selectedWallet && account ? (
        <Davatar size={20} address={account} generatedAvatarType="jazzicon" />
      ) : (
        <IconWallet className="text-primary dark:text-primary-light w-[22px]" />
      )}
      <span className="hidden md:block md:mx-10">{buttonText}</span>
    </button>
  );
};
