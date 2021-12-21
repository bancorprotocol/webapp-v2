import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import {
  getFallbackTokenList,
  getSelectedTokenList,
} from './tokenLists.selector';
import { APIToken } from '../../services/api/bancor';
import { Token } from '../../services/observables/tokens';
import { ropstenImage } from '../../services/web3/config';
import { ITokenListToken } from './tokenLists.slice';
import { EthAddress } from '../../services/web3/types';
import { getUserBalances } from './userData.selector';
import { shallowEqual } from 'react-redux';

// const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

export const getTokens = (showAll: boolean = false) =>
  createSelector(
    [
      (state: RootState) => state.apiData.apiTokens,
      (state: RootState) => getSelectedTokenList(state),
      (state: RootState) => getFallbackTokenList(state),
      (state: RootState) => getUserBalances(state),
    ],
    (
      apiTokens: Map<EthAddress, APIToken>,
      tlTokens: ITokenListToken[],
      tlFallback: ITokenListToken[],
      balances?: Map<EthAddress, string>
    ): Token[] => {
      console.log('getTokens selecotor');
      const fallbackTokens = new Map(tlFallback.map((t) => [t.address, t]));
      // Helper function to build token object
      const buildToken = (
        apiToken: APIToken,
        tlToken?: ITokenListToken
      ): Token => {
        // Set balance; if user is NOT logged in set null
        const balance = balances
          ? balances.get(apiToken.dlt_id.toLowerCase()) ?? '0'
          : null;

        // Get fallback token and set image and name
        const fallbackToken = fallbackTokens.get(apiToken.dlt_id.toLowerCase());
        const logoURI =
          tlToken?.logoURI ?? fallbackToken?.logoURI ?? ropstenImage;
        const name = tlToken?.name ?? fallbackToken?.name ?? apiToken.symbol;

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
          price_change_24: 0, // TODO
          price_history_7d: [], // TODO
          usd_volume_24: '', // TODO
          chainId: 1, // TODO
        };
      };

      // Return all tokens if no token list is selected or showAll prop is true
      if (showAll || tlTokens.length === 0) {
        return Array.from(apiTokens, ([_, apiToken]: [string, APIToken]) =>
          buildToken(apiToken)
        );
      }

      // Return only tokens from selected token list
      // TODO add ETH / WETH token
      return tlTokens
        .map((tlToken) => {
          const apiToken = apiTokens.get(tlToken.address.toLowerCase());
          if (!apiToken) {
            return undefined;
          }
          return buildToken(apiToken, tlToken);
        })
        .filter((token) => !!token) as Token[];
    },
    {
      // New in 4.1: Pass options through to the built-in `defaultMemoize` function
      memoizeOptions: {
        equalityCheck: (a, b) => a === b,
        maxSize: 1000,
        resultEqualityCheck: shallowEqual,
      },
    }
  );
