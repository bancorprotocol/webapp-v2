import { APIPool, APIToken } from '../services/api/bancor';
import { Address } from '../services/web3/types';
import { ITokenListToken } from '../redux/bancor2/tokenLists.slice';
import { Pool, Reserve, Token } from '../services/observables/tokens';
import { ropstenImage } from '../services/web3/config';
import { calculatePercentageChange } from './formulas';
import { get7DaysAgo } from './pureFunctions';
import { UTCTimestamp } from 'lightweight-charts';
import BigNumber from 'bignumber.js';

// Helper function to build token object
export const buildTokenObject = (
  apiToken: APIToken,
  apiPools: APIPool[],
  tlFallback: Map<Address, ITokenListToken>,
  balances?: Map<Address, string>,
  tlToken?: ITokenListToken
): Token => {
  const pool = apiPools.find((p) =>
    p.reserves.find((r) => r.address === apiToken.dlt_id)
  ); // TODO - add usd_volume_24 and isWhiteListed to token api welcome data to avoid this

  // Set balance; if user is NOT logged in set null
  const balance = balances ? balances.get(apiToken.dlt_id) ?? '0' : null;

  // Get fallback token and set image and name
  const fallbackToken = tlFallback.get(apiToken.dlt_id);
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

// Helper function to build pool object
export const buildPoolObject = (
  apiPool: APIPool,
  tkn: Token,
  bnt: Token
): Pool | undefined => {
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

  const reserveTkn = apiPool.reserves.find((r) => r.address === tkn.address);
  if (!reserveTkn) {
    return undefined;
  }
  const reserveBnt = apiPool.reserves.find((r) => r.address === bnt.address);
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

export const buildPoolArray = (
  apiPools: APIPool[],
  tokens: Token[]
): Pool[] => {
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
      return buildPoolObject(apiPool, tkn, bnt);
    })
    .filter((pool) => !!pool) as Pool[];
};
