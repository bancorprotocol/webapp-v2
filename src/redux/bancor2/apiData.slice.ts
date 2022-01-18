import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APIPool, APIToken, WelcomeData } from 'services/api/bancor';
import { buildWethToken } from 'services/web3/config';

interface ApiDataState {
  isApiDataLoaded: boolean;
  apiTokens: APIToken[];
  apiPools: APIPool[];
}

export const initialState: ApiDataState = {
  isApiDataLoaded: false,
  apiTokens: [],
  apiPools: [],
};

const apiDataSlice = createSlice({
  name: 'apiData',
  initialState,
  reducers: {
    setWelcomeData: (state, action: PayloadAction<WelcomeData>) => {
      const weth = buildWethToken(action.payload.tokens);
      state.apiTokens = [...action.payload.tokens, weth];
      state.apiPools = action.payload.pools;
    },
    setIsApiDataLoaded: (state, action: PayloadAction<boolean>) => {
      state.isApiDataLoaded = action.payload;
    },
  },
});

export const { setWelcomeData, setIsApiDataLoaded } = apiDataSlice.actions;

export const apiData = apiDataSlice.reducer;
