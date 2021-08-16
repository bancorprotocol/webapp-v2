import BigNumber from 'bignumber.js';
import { ContractSendMethod } from 'web3-eth-contract';
import { toHex } from 'web3-utils';

const gasEstimaationBuffer = 1.1;

export const determineTxGas = async (
  tx: ContractSendMethod,
  user: string
): Promise<number> => {
  let adjustedGas: number;
  try {
    const withUser = await tx.estimateGas({ from: user });
    adjustedGas = withUser;
  } catch (e) {
    try {
      const withoutUser = await tx.estimateGas();
      adjustedGas = withoutUser;
    } catch (e) {
      throw new Error(`Failed estimating gas for tx ${e}`);
    }
  }
  const bufferedResult = adjustedGas * gasEstimaationBuffer;
  return new BigNumber(bufferedResult.toFixed(0)).toNumber();
};

export const resolveTxOnConfirmation = async ({
  tx,
  value,
  resolveImmediately = false,
  user,
  onHash,
  onConfirmation,
}: {
  tx: ContractSendMethod;
  value?: string;
  resolveImmediately?: boolean;
  user: string;
  onHash?: (hash: string) => void;
  onConfirmation?: (hash: string) => void;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    let txHash: string;
    tx.send({
      from: user,
      ...(value && { value: toHex(value) }),
    })
      .on('transactionHash', (hash: string) => {
        txHash = hash;
        if (onHash) onHash(hash);
        if (resolveImmediately) {
          resolve(txHash);
        }
      })
      .on('confirmation', (confirmationNumber: number) => {
        if (confirmationNumber === 1) {
          if (onConfirmation) onConfirmation(txHash);
          resolve(txHash);
        }
      })
      .on('error', (error: any) => reject(error));
  });
};
