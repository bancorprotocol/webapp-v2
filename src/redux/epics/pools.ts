import { mapTo, tap, mergeMap, map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { pools$ } from 'observables/pools';

export const poolsEpic$ = (action$: any) =>
  action$.pipe(
    ofType("FETCH_POOLS"),
    mergeMap(() =>  pools$),
    tap((data) => console.log(data, 'is on the tap')),
    map(x => {
      return { type: 'PONG' }
    })
  );
