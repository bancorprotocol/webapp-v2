import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APIPool, APIToken, WelcomeData } from '../../services/api/bancor';
import { EthAddress } from '../../services/web3/types';

interface ApiDataState {
  isApiDataLoaded: boolean;
  apiTokens: Map<EthAddress, APIToken>;
  apiPools: Map<EthAddress, APIPool>;
}

export const initialState: ApiDataState = {
  isApiDataLoaded: false,
  apiTokens: new Map(),
  apiPools: new Map(),
};

const apiDataSlice = createSlice({
  name: 'apiData',
  initialState,
  reducers: {
    setWelcomeData: (state, action: PayloadAction<WelcomeData>) => {
      state.apiTokens = new Map(
        action.payload.tokens.map((t) => [t.dlt_id.toLowerCase(), t])
      );
      state.apiPools = new Map(
        action.payload.pools.map((p) => [p.pool_dlt_id, p])
      );
    },
    setIsApiDataLoaded: (state, action: PayloadAction<boolean>) => {
      state.isApiDataLoaded = action.payload;
    },
  },
});

export const { setWelcomeData, setIsApiDataLoaded } = apiDataSlice.actions;

export const apiData = apiDataSlice.reducer;
