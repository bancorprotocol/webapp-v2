import { filter, mapTo, tap } from 'rxjs/operators';
import { ofType } from 'redux-observable';

export const poolsEpic$ = (action$: any) =>
  action$.pipe(
    tap((data) => console.log(data, 'is on the tap')),
    mapTo({ type: 'PONG' })
  );
