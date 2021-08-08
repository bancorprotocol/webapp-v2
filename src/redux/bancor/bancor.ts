import { createSlice } from '@reduxjs/toolkit';
import { Pool } from 'services/api/bancor';
import { KeeprDaoToken } from 'services/api/keeperDao';
import { TokenList, Token } from 'services/observables/tokens';

interface BancorState {
  tokenLists: TokenList[];
  tokens: Token[];
  keeperDaoTokens: KeeprDaoToken[];
  pools: Pool[];
}

export const initialState: BancorState = {
  tokenLists: [],
  tokens: [],
  keeperDaoTokens: [],
  pools: [],
};

const bancorSlice = createSlice({
  name: 'bancor',
  initialState,
  reducers: {
    setTokenLists: (state, action) => {
      state.tokenLists = action.payload;
    },
    setTokenList: (state, action) => {
      state.tokens = action.payload;
    },
    setKeeperDaoTokens: (state, action) => {
      state.keeperDaoTokens = action.payload;
    },
    setPools: (state, action) => {
      state.pools = action.payload;
    },
  },
});

export const { setTokenLists, setTokenList, setKeeperDaoTokens, setPools } =
  bancorSlice.actions;

export const bancor = bancorSlice.reducer;
