import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { Address } from '../../services/web3/types';
import { UserTokenBalance } from './userData.slice';
import { utils } from 'ethers';

export const getUserBalances = createSelector(
  [
    (state: RootState) => state.userData.balances,
    (state: RootState) => state.userData.currentUser,
  ],
  (
    balances: UserTokenBalance[],
    currentUser?: Address
  ): Map<Address, string> | undefined => {
    if (!currentUser) {
      return undefined;
    }

    return new Map(
      balances.map((item) => [utils.getAddress(item.address), item.balance])
    );
  }
);
