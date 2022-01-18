import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import {
  getFallbackTokenList,
  getSelectedTokenList,
} from './tokenLists.selector';
import { APIPool, APIToken } from 'services/api/bancor';
import { Token } from 'services/observables/tokens';
import { ropstenImage } from 'services/web3/config';
import { ITokenListToken } from './tokenLists.slice';
import { Address } from 'services/web3/types';
import { getUserBalances } from './userData.selector';
import { calculatePercentageChange } from 'utils/formulas';
import { get7DaysAgo } from 'utils/pureFunctions';
import { UTCTimestamp } from 'lightweight-charts';
import { getApiPools, getApiTokens } from './apiData.selector';

interface BuildTokenProps {
  apiToken: APIToken;
  apiPools: APIPool[];
  tlFallback: Map<Address, ITokenListToken>;
  balances?: Map<Address, string>;
  tlToken?: ITokenListToken;
}

// Helper function to build token object
const buildToken = ({
  apiToken,
  apiPools,
  tlFallback,
  balances,
  tlToken,
}: BuildTokenProps): Token => {
  const pool = apiPools.find((p) =>
    p.reserves.find(
      (r) => r.address.toLowerCase() === apiToken.dlt_id.toLowerCase()
    )
  ); // TODO - add usd_volume_24 and isWhiteListed to token api welcome data to avoid this

  // Set balance; if user is NOT logged in set null
  const balance = balances
    ? balances.get(apiToken.dlt_id.toLowerCase()) ?? '0'
    : null;

  // Get fallback token and set image and name
  const fallbackToken = tlFallback.get(apiToken.dlt_id.toLowerCase());
  const logoURI = tlToken?.logoURI ?? fallbackToken?.logoURI ?? ropstenImage;
  const name = tlToken?.name ?? fallbackToken?.name ?? apiToken.symbol;

  const price_change_24 =
    calculatePercentageChange(
      Number(apiToken.rate.usd),
      Number(apiToken.rate_24h_ago.usd)
    ) || 0;

  const seven_days_ago = get7DaysAgo().getUTCSeconds();
  const price_history_7d = apiToken.rates_7d
    .filter((x) => !!x)
    .map((x, i) => ({
      value: Number(x),
      time: (seven_days_ago + i * 360) as UTCTimestamp,
    }));

  const usd_volume_24 = pool ? pool.volume_24h.usd : null;
  const isProtected = pool ? pool.isWhitelisted : false;

  return {
    name,
    logoURI,
    balance,
    address: apiToken.dlt_id,
    decimals: apiToken.decimals,
    symbol: apiToken.symbol,
    liquidity: apiToken.liquidity.usd,
    usdPrice: apiToken.rate.usd,
    usd_24h_ago: apiToken.rate_24h_ago.usd,
    price_change_24,
    price_history_7d,
    usd_volume_24,
    isProtected, // TODO currently based on isWhitelisted
    chainId: 1, // TODO not yet in redux state
  };
};

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
    // Return only tokens from selected token list
    return Array.from(tlTokens.values(), (tlToken) => {
      const apiToken = apiTokens.get(tlToken.address);
      if (!apiToken) {
        return undefined;
      }
      return buildToken({
        apiToken,
        apiPools,
        tlFallback,
        balances,
        tlToken,
      });
    }).filter((token) => !!token) as Token[];
  }
);

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
    // Return all tokens
    return Array.from(apiTokens.values(), (apiToken) => {
      const tlToken = tlTokens.get(apiToken.dlt_id);
      return buildToken({
        apiToken,
        apiPools,
        tlFallback,
        balances,
        tlToken,
      });
    });
  }
);
