import { Pool } from 'services/observables/tokens';

export const PoolsTableCellApr = (pool: Pool) => {
  const aprOne = pool.reserves[0].rewardApr;
  const aprTwo = pool.reserves[1].rewardApr;
  const symbolOne = pool.reserves[0].symbol;
  const symbolTwo = pool.reserves[1].symbol;
  const ends_at = pool.reward?.ends_at;
  const formatApr = (rewardApr: number) => (rewardApr + pool.apr).toFixed(2);
  return aprOne && aprTwo && ends_at ? (
    <div className="flex items-center w-full">
      <div className="flex justify-start w-full">
        <span className="">{`${symbolTwo} ${formatApr(aprTwo)}%`}</span>
        <span className="text-center px-10">|</span>
        <span className="">{`${symbolOne} ${formatApr(aprOne)}%`}</span>
      </div>
    </div>
  ) : (
    ''
  );
};
