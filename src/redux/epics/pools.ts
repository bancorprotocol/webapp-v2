import { tap, mergeMap, map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { pools$ } from 'observables/pools';
import { poolActions } from 'redux/actions';

export const poolsEpic$ = (action$: any) =>
  action$.pipe(
    ofType(poolActions.trigger),
    mergeMap(() => pools$),
    tap((data) => console.log(data, 'is on the tap')),
    map((pools) => poolActions.successAction(pools))
  );
