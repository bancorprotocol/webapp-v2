import { ITokenList, ITokenListToken, TokenListName } from './tokenLists.slice';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { ethToken } from '../../services/web3/config';

const ETH = {
  address: ethToken,
  symbol: 'ETH',
  name: 'Ethereum',
  logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
};

export const getSelectedTokenList = createSelector(
  [
    (state: RootState) => state.tokenLists.tokenLists,
    (state: RootState) => state.tokenLists.selectedTokenList,
  ],
  (
    tokenLists: Map<TokenListName, ITokenList>,
    selected: TokenListName
  ): ITokenListToken[] => {
    const list = tokenLists.get(selected);
    if (!list) {
      return [];
    }
    return [ETH, ...list.tokens];
  }
);

export const getFallbackTokenList = createSelector(
  [
    (state: RootState) => state.tokenLists.tokenLists,
    (state: RootState) => state.tokenLists.fallbackTokenList,
  ],
  (
    tokenLists: Map<TokenListName, ITokenList>,
    fallback: TokenListName
  ): ITokenListToken[] => {
    const list = tokenLists.get(fallback);
    if (!list) {
      return [];
    }
    return [ETH, ...list.tokens];
  }
);
