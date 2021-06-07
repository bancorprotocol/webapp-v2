import { tap, mergeMap, map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { pools$ } from 'observables/pools';
import { poolActions, tokenActions } from 'redux/actions';

export const tokenEpic$ = (action$: any) =>
  action$.pipe(
    ofType(tokenActions.trigger),
    mergeMap(() => pools$),
    tap((data) => console.log(data, 'is on the tap')),
    map((tokens) => tokenActions.successAction(tokens))
  );
