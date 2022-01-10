import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { Address } from '../../services/web3/types';

export const getUserBalances = createSelector(
  [
    (state: RootState) => state.userData.balances,
    (state: RootState) => state.userData.currentUser,
  ],
  (
    balances: Map<Address, string>,
    currentUser?: Address
  ): Map<Address, string> | undefined => {
    if (!currentUser) {
      return undefined;
    }

    return balances;
  }
);
