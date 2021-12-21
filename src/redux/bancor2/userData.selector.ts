import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { EthAddress } from '../../services/web3/types';

export const getUserBalances = createSelector(
  [
    (state: RootState) => state.userData.balances,
    (state: RootState) => state.userData.currentUser,
  ],
  (
    balances: Map<EthAddress, string>,
    currentUser?: EthAddress
  ): Map<EthAddress, string> | undefined => {
    if (!currentUser) {
      return undefined;
    }

    return balances;
  }
);
