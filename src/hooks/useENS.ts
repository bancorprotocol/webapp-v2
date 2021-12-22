import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { EthNetworks } from 'services/web3/types';
import { buildAlchemyUrl } from 'services/web3/wallet/connectors';

const useENS = (address: string) => {
  const provider = new ethers.providers.JsonRpcProvider(
    buildAlchemyUrl(EthNetworks.Mainnet)
  );
  const [ensName, setENSName] = useState<string | null>(null);

  useEffect(() => {
    const resolveENS = async () => {
      if (ethers.utils.isAddress(address)) {
        let ensName = await provider.lookupAddress(address);
        if (ensName) setENSName(ensName);
      }
    };
    resolveENS();
  }, [address]);

  return { ensName };
};

export default useENS;
