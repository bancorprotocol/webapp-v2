import { Ticker } from 'components/ticker/Ticker';
import { useAppSelector } from 'redux/index';
import { Pool } from 'services/api/bancor';
import { Token } from 'services/observables/tokens';
import { prettifyNumber } from 'utils/helperFunctions';

export const TopPools = () => {
  const pools = useAppSelector<Pool[]>((state) => state.bancor.pools);
  const topPools = pools?.slice(0, 20);

  return (
    <section className="content-section pt-20 pb-10">
      <h2 className="ml-20">Top Pools</h2>
      <hr className="content-separator my-14 mx-20" />
      <Ticker id="top-tokens">
        <div className="flex space-x-16 mt-10">
          {pools && pools.length
            ? topPools.map((pool) => (
                <div
                  key={pool.pool_dlt_id}
                  className="flex items-center justify-center min-w-[150px] h-[75px] rounded-[6px] bg-blue-0 dark:bg-blue-2 shadow-content dark:shadow-none"
                >
                  {/* <img
                    src={token.logoURI.replace('thumb', 'small')}
                    alt="Token Logo"
                    className="w-50 h-50 rounded-full"
                  /> */}
                  {/* <div className="ml-10 text-12 dark:text-grey-3">
                    <div className="font-medium">{pool.symbol}</div>
                    <div>{prettifyNumber(token.usdPrice ?? 0, true)}</div>
                    <div className="font-bold text-success">+102.75%</div>
                  </div> */}
                </div>
              ))
            : [...Array(20)].map((_, index) => (
                <div
                  key={index}
                  className="loading-skeleton !rounded-[6px] min-w-[150px] h-[75px]"
                ></div>
              ))}
        </div>
      </Ticker>
    </section>
  );
};
