import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APIPool, APIToken, WelcomeData } from 'services/api/bancor';

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
      state.apiTokens = action.payload.tokens;
      state.apiPools = action.payload.pools;
    },
    setIsApiDataLoaded: (state, action: PayloadAction<boolean>) => {
      state.isApiDataLoaded = action.payload;
    },
  },
});

export const { setWelcomeData, setIsApiDataLoaded } = apiDataSlice.actions;

export const apiData = apiDataSlice.reducer;
