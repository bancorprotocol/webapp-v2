import { ViewPool, ViewToken } from 'web3/types';
import { createSlice } from '@reduxjs/toolkit';
import { WelcomeData } from 'api/bancor';
import { poolActions } from 'redux/actions';

export interface InitialState {
  welcomeData: WelcomeData;
  tokens: ViewToken[];
  pools: ViewPool[];
  totalLiquidityUsd: null | number;
  totalVolume24h: null | number;
  bntPrice: null | number;
  bntPrice24hAgo: null | number;
  currentUser: string;
}

export const initialState: InitialState = {
  welcomeData: {
    total_liquidity: { usd: null },
    total_volume_24h: { usd: null },
    bnt_price_24h_ago: { usd: null },
    bnt_price: { usd: null },
    bnt_supply: '',
    swaps: [],
    pools: [],
    tokens: [],
  },
  tokens: [],
  pools: [],
  totalLiquidityUsd: null,
  totalVolume24h: null,
  bntPrice: null,
  bntPrice24hAgo: null,
  currentUser: '',
};

const userSlice = createSlice({
  name: 'bancorAPI',
  initialState,
  reducers: {
    setWelcomeData: (bancorAPI, action) => {
      bancorAPI.welcomeData = action.payload;
    },
    setTokens: (state, action) => {
      state.welcomeData.tokens = action.payload;
    },
    setPools: (state, action) => {
      state.welcomeData.pools = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(poolActions.success([]).type, (state, action) => {
      state.welcomeData = action.payload;
    });
  },
});

export const { setWelcomeData, setTokens, setPools } = userSlice.actions;

export const bancorAPI = userSlice.reducer;
