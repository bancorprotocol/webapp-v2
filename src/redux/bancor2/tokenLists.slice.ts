import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address } from 'services/web3/types';
import { getTokenListLS, setTokenListLS } from 'utils/localStorage';

export type TokenListName = '1inch' | 'CoinGecko' | 'Defiprime' | '';

export interface ITokenListToken {
  address: Address;
  name: string;
  symbol: string;
  logoURI?: string;
}

export interface ITokenList {
  name: TokenListName;
  tokens: ITokenListToken[];
  logoURI: string;
}

interface TokenListsState {
  isTokenListDataLoaded: boolean;
  tokenLists: ITokenList[];
  selectedTokenList: TokenListName[];
  fallbackTokenList: TokenListName;
}

export const initialState: TokenListsState = {
  isTokenListDataLoaded: false,
  tokenLists: [],
  selectedTokenList: [],
  fallbackTokenList: '1inch',
};

const tokenListsSlice = createSlice({
  name: 'tokenLists',
  initialState,
  reducers: {
    setTokenListData: (state, action: PayloadAction<ITokenList[]>) => {
      state.tokenLists = action.payload;
      const defaultFirst = action.payload[0].name;
      const defaultSecond = action.payload[1].name;
      state.selectedTokenList = getTokenListLS() ?? [
        defaultFirst,
        defaultSecond,
      ];
    },
    setIsTokenListDataLoaded: (state, action: PayloadAction<boolean>) => {
      state.isTokenListDataLoaded = action.payload;
    },
    setSelectedTokenList: (state, action: PayloadAction<TokenListName>) => {
      const index = state.selectedTokenList.indexOf(action.payload);
      if (index > -1) {
        state.selectedTokenList.splice(index, 1);
      } else {
        state.selectedTokenList.push(action.payload);
      }
      setTokenListLS(state.selectedTokenList);
    },
  },
});

export const {
  setTokenListData,
  setIsTokenListDataLoaded,
  setSelectedTokenList,
} = tokenListsSlice.actions;

export const tokenLists = tokenListsSlice.reducer;
