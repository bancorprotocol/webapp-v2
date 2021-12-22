import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { getProvider } from 'services/web3';
import { EthNetworks } from 'services/web3/types';

const useENS = (address: string | null | undefined) => {
  const provider = getProvider(EthNetworks.Mainnet);
  const [ensName, setENSName] = useState<string | null>(null);

  useEffect(() => {
    const resolveENS = async () => {
      if (address && ethers.utils.isAddress(address)) {
        let ensName = await provider.lookupAddress(address);
        if (ensName) setENSName(ensName);
      }
    };
    resolveENS();
  }, [address]);

  return { ensName };
};

export default useENS;
