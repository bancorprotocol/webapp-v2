import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import {
  getFallbackTokenList,
  getSelectedTokenList,
} from './tokenLists.selector';
import { APIPool, APIToken } from 'services/api/bancor';
import { Token } from 'services/observables/tokens';
import { ITokenListToken } from './tokenLists.slice';
import { Address } from 'services/web3/types';
import { getUserBalances } from './userData.selector';
import { getApiPools, getApiTokens } from './apiData.selector';
import { buildTokenObject } from 'utils/selectorHelper';

// Return only tokens from selected token list
export const getAllTokensByTL = createSelector(
  [
    (state: RootState) => getApiTokens(state),
    (state: RootState) => getApiPools(state),
    (state: RootState) => getSelectedTokenList(state),
    (state: RootState) => getFallbackTokenList(state),
    (state: RootState) => getUserBalances(state),
  ],
  (
    apiTokens: Map<Address, APIToken>,
    apiPools: APIPool[],
    tlTokens: Map<Address, ITokenListToken>,
    tlFallback: Map<Address, ITokenListToken>,
    balances?: Map<Address, string>
  ): Token[] => {
    return Array.from(tlTokens.values(), (tlToken) => {
      const apiToken = apiTokens.get(tlToken.address);
      if (!apiToken) {
        return undefined;
      }
      return buildTokenObject(
        apiToken,
        apiPools,
        tlFallback,
        balances,
        tlToken
      );
    }).filter((token) => !!token) as Token[];
  }
);

// Return all tokens
export const getAllTokens = createSelector(
  [
    (state: RootState) => getApiTokens(state),
    (state: RootState) => getApiPools(state),
    (state: RootState) => getSelectedTokenList(state),
    (state: RootState) => getFallbackTokenList(state),
    (state: RootState) => getUserBalances(state),
  ],
  (
    apiTokens: Map<Address, APIToken>,
    apiPools: APIPool[],
    tlTokens: Map<Address, ITokenListToken>,
    tlFallback: Map<Address, ITokenListToken>,
    balances?: Map<Address, string>
  ): Token[] => {
    return Array.from(apiTokens.values(), (apiToken) => {
      const tlToken = tlTokens.get(apiToken.dlt_id);
      return buildTokenObject(
        apiToken,
        apiPools,
        tlFallback,
        balances,
        tlToken
      );
    });
  }
);
