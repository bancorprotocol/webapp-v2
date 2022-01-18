import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { APIPool } from 'services/api/bancor';
import { Pool, Token } from 'services/observables/tokens';
import { getAllTokens, getAllTokensByTL } from './tokens.selector';
import { getApiPools } from './apiData.selector';
import { buildPoolArray } from 'utils/selectorHelper';

export const getAllPoolsByTL = createSelector(
  [
    (state: RootState) => getApiPools(state),
    (state: RootState) => getAllTokensByTL(state),
  ],
  (apiPools: APIPool[], tokens: Token[]): Pool[] => {
    return buildPoolArray(apiPools, tokens);
  }
);

export const getAllPools = createSelector(
  [
    (state: RootState) => getApiPools(state),
    (state: RootState) => getAllTokens(state),
  ],
  (apiPools: APIPool[], tokens: Token[]): Pool[] => {
    return buildPoolArray(apiPools, tokens);
  }
);
