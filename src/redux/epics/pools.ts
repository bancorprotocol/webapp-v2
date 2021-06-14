import { mergeMap, map, filter } from 'rxjs/operators';
import { pools$ } from 'observables/pools';
import { poolActions } from 'redux/actions';
import { isActionOf } from 'typesafe-actions';
import { Pool } from 'api/bancor';

export const poolsEpic$ = (action$: any) =>
  action$.pipe(
    filter(isActionOf(poolActions.request)),
    mergeMap(() => pools$),
    map((pools) => poolActions.success(pools as Pool[]))
  );
