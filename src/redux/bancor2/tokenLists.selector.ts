import { ITokenList, ITokenListToken, TokenListName } from './tokenLists.slice';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { ethToken } from 'services/web3/config';
import { uniqBy } from 'lodash';

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
  (tokenLists: ITokenList[], selected: TokenListName[]): ITokenListToken[] => {
    if (!selected.length) {
      return [];
    }
    const selectedTokenLists = tokenLists.filter((list) =>
      selected.some((id) => id === list.name)
    );
    const merged = selectedTokenLists.flatMap((list) => list.tokens);
    const uniqueTokens = uniqBy(merged, (tlToken) =>
      tlToken.address.toLowerCase()
    );
    return [ETH, ...uniqueTokens];
  }
);

export const getFallbackTokenList = createSelector(
  [
    (state: RootState) => state.tokenLists.tokenLists,
    (state: RootState) => state.tokenLists.fallbackTokenList,
  ],
  (tokenLists: ITokenList[], fallback: TokenListName): ITokenListToken[] => {
    const list = tokenLists.find((list) => list.name === fallback);
    if (!list) {
      return [];
    }
    return [ETH, ...list.tokens];
  }
);
