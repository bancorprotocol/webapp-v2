import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APIData } from 'services/api/bancor';

interface ApiDataState {
  isApiDataLoaded: boolean;
  apiData?: APIData;
}

export const initialState: ApiDataState = {
  isApiDataLoaded: false,
  apiData: undefined,
};

const apiDataSlice = createSlice({
  name: 'apiData',
  initialState,
  reducers: {
    setAPIData: (state, action: PayloadAction<APIData>) => {
      state.apiData = action.payload;
    },
    setIsApiDataLoaded: (state, action: PayloadAction<boolean>) => {
      state.isApiDataLoaded = action.payload;
    },
  },
});

export const { setAPIData, setIsApiDataLoaded } = apiDataSlice.actions;

export const apiData = apiDataSlice.reducer;
