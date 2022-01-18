import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { APIPool } from 'services/api/bancor';
import { Pool, Reserve, Token } from 'services/observables/tokens';
import { getAllTokensByTL } from './tokens.selector';
import BigNumber from 'bignumber.js';
import { getApiPools } from './apiData.selector';

interface BuildPoolProps {
  apiPool: APIPool;
  tkn: Token;
  bnt: Token;
}

// Helper function to build pool object
const buildPool = ({ apiPool, tkn, bnt }: BuildPoolProps): Pool | undefined => {
  const liquidity = Number(apiPool.liquidity.usd ?? 0);
  const fees_24h = Number(apiPool.fees_24h.usd ?? 0);
  let apr = 0;
  if (liquidity && fees_24h) {
    apr = new BigNumber(fees_24h)
      .times(365)
      .div(liquidity)
      .times(100)
      .toNumber();
  }

  const reserveTkn = apiPool.reserves.find(
    (r) => r.address.toLowerCase() === tkn.address.toLowerCase()
  );
  if (!reserveTkn) {
    return undefined;
  }
  const reserveBnt = apiPool.reserves.find(
    (r) => r.address.toLowerCase() === bnt.address.toLowerCase()
  );
  if (!reserveBnt) {
    return undefined;
  }

  const reserves: Reserve[] = [
    {
      ...reserveTkn,
      rewardApr: Number(reserveTkn.apr) / 10000,
      symbol: tkn.symbol,
      logoURI: tkn.logoURI,
      decimals: tkn.decimals,
      usdPrice: tkn.usdPrice,
    },
    {
      ...reserveBnt,
      rewardApr: Number(reserveBnt.apr) / 10000,
      symbol: bnt.symbol,
      logoURI: bnt.logoURI,
      decimals: bnt.decimals,
      usdPrice: bnt.usdPrice,
    },
  ];

  return {
    name: apiPool.name,
    pool_dlt_id: apiPool.pool_dlt_id,
    converter_dlt_id: apiPool.converter_dlt_id,
    reserves,
    liquidity,
    volume_24h: Number(apiPool.volume_24h.usd ?? 0),
    fees_24h,
    fee: Number(apiPool.fee) / 10000,
    version: apiPool.version,
    supply: Number(apiPool.supply),
    decimals: apiPool.decimals,
    apr,
    reward: apiPool.reward,
    isProtected: apiPool.isWhitelisted, // TODO add isProtected by fetching minNetworkTokenLiquidityForMinting
  };
};

export const getAllPoolsByTL = createSelector(
  [
    (state: RootState) => getApiPools(state),
    (state: RootState) => getAllTokensByTL(state),
  ],
  (apiPools: APIPool[], tokens: Token[]): Pool[] => {
    const bnt = tokens.find((t) => t.symbol === 'BNT');
    if (!bnt) {
      return [];
    }
    return tokens
      .map((tkn) => {
        if (tkn.symbol === 'BNT') {
          return undefined;
        }
        const apiPool = apiPools.find((pool) => {
          return pool.reserves.find((reserve) => {
            return reserve.address === tkn.address;
          });
        });
        if (!apiPool) {
          return undefined;
        }
        return buildPool({ apiPool, tkn, bnt });
      })
      .filter((pool) => !!pool) as Pool[];
  }
);
