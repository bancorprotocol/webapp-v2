import { Token } from 'services/observables/tokens';
import {
  SignedRfqOrder,
  sendOrders,
  getOrderDetails,
  RfqOrder,
  Signature,
} from 'services/api/keeperDao';
import { NULL_ADDRESS } from '@0x/utils';
import { splitSignature } from '@ethersproject/bytes';
import { ErrorCode } from 'services/web3/types';
import { wethToken } from 'services/web3/config';
import { writeWeb3 } from 'services/web3';
import BigNumber from 'bignumber.js';
import dayjs from 'utils/dayjs';
import {
  BaseNotification,
  NotificationType,
} from 'redux/notification/notification';
import { expandToken } from 'utils/formulas';
import { Weth__factory } from '../abis/types';

export const depositWeth = async (amount: string) => {
  const tokenContract = Weth__factory.connect(wethToken, writeWeb3.signer);
  const wei = expandToken(amount, 18);

  const tx = await tokenContract.deposit({ value: wei });
  return tx.hash;
};

export const withdrawWeth = async (
  amount: string
): Promise<BaseNotification> => {
  const tokenContract = Weth__factory.connect(wethToken, writeWeb3.signer);
  const wei = expandToken(amount, 18);

  try {
    const tx = await tokenContract.withdraw(wei);

    return {
      type: NotificationType.pending,
      title: 'Pending Confirmation',
      msg: 'Withdraw WETH is pending confirmation',
      txHash: tx.hash,
      updatedInfo: {
        successTitle: 'Success!',
        successMsg: `Your withdraw of ${amount} WETH has been confirmed`,
        errorTitle: 'Transaction Failed',
        errorMsg: `Withdrawing ${amount} WETH had failed. Please try again or contact support.`,
      },
    };
  } catch (e: any) {
    if (e.code === ErrorCode.DeniedTx)
      return {
        type: NotificationType.error,
        title: 'Transaction Rejected',
        msg: 'You rejected the transaction. If this was by mistake, please try again.',
      };

    return {
      type: NotificationType.error,
      title: 'Transaction Failed',
      msg: `Withdrawing ${amount} WETH had failed. Please try again or contact support.`,
    };
  }
};

export const createOrder = async (
  fromToken: Token,
  toToken: Token,
  from: string,
  to: string,
  user: string,
  seconds: number
): Promise<void> => {
  // Unix timestamp for expiry in seconds
  const now = dayjs().unix();
  const expiry = now + seconds;

  // Arbitrary value for salt
  const salt = Date.now() * 1000;

  // Token Amounts
  const makerAmount = new BigNumber(
    expandToken(from, fromToken.decimals)
  ).toString();
  const takerAmount = new BigNumber(
    expandToken(to, toToken.decimals)
  ).toString();

  // HidingBook Order Details
  const orderDetails = await getOrderDetails();

  // RfqOrder structure to be signed
  const rfqOrder: RfqOrder = {
    makerToken: fromToken.address.toLowerCase(),
    takerToken: toToken.address.toLowerCase(),
    makerAmount,
    takerAmount,
    maker: user.toLowerCase(),
    taker: NULL_ADDRESS.toLocaleLowerCase(),
    txOrigin: orderDetails.txOrigin,
    pool: orderDetails.pool,
    expiry,
    salt,
  };

  // Sign typed RFQ order
  const signature = await writeWeb3.signer._signTypedData(
    domain(orderDetails.verifyingContract),
    types,
    rfqOrder
  );

  // Convert signature to expanded format
  const expandedSignature = expandSignature(signature);

  // Submit Signed Order to HidingBook
  const signedOrder: SignedRfqOrder = {
    ...rfqOrder,
    chainId: orderDetails.chainId,
    signature: expandedSignature,
    verifyingContract: orderDetails.verifyingContract,
  };

  await sendOrders([signedOrder]);
};

// Converts flat-formatted signature to expanded-format
const expandSignature = (signature: string): Signature => {
  const expanded = splitSignature(signature);
  return {
    r: expanded.r,
    s: expanded.s,
    v: expanded.v,
    signatureType: 2, //EIP-712
  };
};

const domain = (exchangeProxyAddress: string) => ({
  chainId: 1,
  verifyingContract: exchangeProxyAddress,
  name: 'ZeroEx',
  version: '1.0.0',
});

const types = {
  RfqOrder: [
    { type: 'address', name: 'makerToken' },
    { type: 'address', name: 'takerToken' },
    { type: 'uint128', name: 'makerAmount' },
    { type: 'uint128', name: 'takerAmount' },
    { type: 'address', name: 'maker' },
    { type: 'address', name: 'taker' },
    { type: 'address', name: 'txOrigin' },
    { type: 'bytes32', name: 'pool' },
    { type: 'uint64', name: 'expiry' },
    { type: 'uint256', name: 'salt' },
  ],
};
