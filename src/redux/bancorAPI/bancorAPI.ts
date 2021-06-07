import { createSlice } from '@reduxjs/toolkit';
import { WelcomeData } from 'api/bancor';
import { poolActions } from 'redux/actions';

export const initialState: { welcomeData: WelcomeData } = {
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
};


const userSlice = createSlice({
  name: 'bancorAPI',
  initialState,
  reducers: {
    setWelcomeData: (bancorAPI, action) => {
      bancorAPI.welcomeData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(poolActions.success, (state, action) => {
      state.welcomeData = action.payload;
    });
  },
});

export const { setWelcomeData } = userSlice.actions;

export const bancorAPI = userSlice.reducer;
