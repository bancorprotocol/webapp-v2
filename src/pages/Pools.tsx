import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadPoolData } from 'services/observables/triggers';
import { TopPools } from 'elements/pools/TopPools';
import { PoolsTable } from 'elements/pools/PoolsTable';

export const Pools = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    loadPoolData(dispatch);
  }, [dispatch]);

  return (
    <div className="space-y-30">
      <TopPools />
      <PoolsTable />
    </div>
  );
};
