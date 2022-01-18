import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { APIData, APIPool, APIToken } from 'services/api/bancor';
import { buildWethToken } from 'services/web3/config';
import { utils } from 'ethers';
import { Address } from 'services/web3/types';

export const getApiTokens = createSelector(
  [(state: RootState) => state.apiData.apiData],
  (apiData?: APIData): Map<Address, APIToken> => {
    if (!apiData) {
      return new Map();
    }

    const wethToken = buildWethToken(apiData.tokens);
    const apiTokensWithWeth = [...apiData.tokens, wethToken];

    const normalized: APIToken[] = apiTokensWithWeth.map((token) => {
      return { ...token, dlt_id: utils.getAddress(token.dlt_id) };
    });

    return new Map(normalized.map((token) => [token.dlt_id, token]));
  }
);

export const getApiPools = createSelector(
  [(state: RootState) => state.apiData.apiData],
  (apiData?: APIData): APIPool[] => {
    if (!apiData) {
      return [];
    }

    return apiData.pools.map((pool) => {
      return {
        ...pool,
        pool_dlt_id: utils.getAddress(pool.pool_dlt_id),
        converter_dlt_id: utils.getAddress(pool.converter_dlt_id),
        reserves: pool.reserves.map((reserve) => {
          return {
            ...reserve,
            address: utils.getAddress(reserve.address),
          };
        }),
      };
    });
  }
);
