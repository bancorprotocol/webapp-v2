import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address } from '../../services/web3/types';
import { utils } from 'ethers';

export interface UserTokenBalance {
  address: Address;
  balance: string;
}

const mockBalances: UserTokenBalance[] = [
  {
    address: utils.getAddress('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'),
    balance: '100.0000',
  },
  {
    address: utils.getAddress('0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C'),
    balance: '200.0000',
  },
  {
    address: utils.getAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'),
    balance: '300.0000',
  },
];

interface UserDataState {
  currentUser?: Address;
  balances: UserTokenBalance[];
  isLoading: boolean;
}

export const initialState: UserDataState = {
  currentUser: undefined,
  isLoading: true,
  balances: [],
};

const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<Address | undefined>) => {
      state.currentUser = action.payload;
    },
    setBalances: (state) => {
      state.balances = mockBalances;
    },
    setBalancesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setBalances, setBalancesLoading, setCurrentUser } =
  userDataSlice.actions;

export const userData = userDataSlice.reducer;
