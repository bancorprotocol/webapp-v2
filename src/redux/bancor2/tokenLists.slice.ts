import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EthAddress } from '../../services/web3/types';

export type TokenListName = '1inch' | 'CoinGecko' | 'Defiprime' | '';

export interface ITokenListToken {
  address: EthAddress;
  name: string;
  symbol: string;
  logoURI: string;
}

export interface ITokenList {
  name: TokenListName;
  tokens: ITokenListToken[];
  logoURI: string;
}

interface TokenListsState {
  isTokenListDataLoaded: boolean;
  tokenLists: Map<TokenListName, ITokenList>;
  selectedTokenList: TokenListName;
  fallbackTokenList: TokenListName;
}

export const initialState: TokenListsState = {
  isTokenListDataLoaded: false,
  tokenLists: new Map(),
  selectedTokenList: '1inch',
  fallbackTokenList: 'CoinGecko',
};

const tokenListsSlice = createSlice({
  name: 'tokenLists',
  initialState,
  reducers: {
    setTokenListData: (state, action: PayloadAction<ITokenList[]>) => {
      state.tokenLists = new Map(action.payload.map((tl) => [tl.name, tl]));
    },
    setIsTokenListDataLoaded: (state, action: PayloadAction<boolean>) => {
      state.isTokenListDataLoaded = action.payload;
    },
    setSelectedTokenList: (state, action: PayloadAction<TokenListName>) => {
      state.selectedTokenList = action.payload;
    },
  },
});

export const {
  setTokenListData,
  setIsTokenListDataLoaded,
  setSelectedTokenList,
} = tokenListsSlice.actions;

export const tokenLists = tokenListsSlice.reducer;
