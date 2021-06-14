import {
  tap,
  mergeMap,
  map,
  filter,
  pluck,
  withLatestFrom,
  catchError,
  takeUntil,
  mapTo,
  mergeMapTo,
} from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { pools$, tokens$ } from 'observables/pools';
import { balanceActions, poolActions } from 'redux/actions';
import { isActionOf } from 'typesafe-actions';
import { from, Observable, of } from 'rxjs';
import { toChecksumAddress } from 'web3-utils';
import { InitialState } from 'redux/bancorAPI/bancorAPI';
import { balanceFetcher } from 'web3/contracts/token/wrapper';
import { partition } from 'lodash';
import { shrinkToken } from 'utils/pureFunctions';

interface Action<T = undefined> {
  payload?: T;
  type: string;
}

export const balancesEpic$ = (
  action$: Observable<Action>,
  state$: Observable<InitialState>
) =>
  action$.pipe(
    filter(isActionOf(balanceActions.request)),
    pluck('payload'),
    map((addresses) => addresses.map(toChecksumAddress)),
    withLatestFrom(state$),
    filter(([addresses, state]) => {
      const authenticated = !!state.currentUser;
      if (authenticated) return true;
      else {
        console.warn(
          `Requested a balance fetch of ${addresses.length} tokens but not currently authenticated`
        );
        return false;
      }
    }),
    mergeMap(([addresses, state]) =>
      balanceFetcher(state.currentUser, addresses)
    ),
    withLatestFrom(tokens$),
    map(([balances, tokens]) => {
      const [knownPrecisions, unknownPrecisions] = partition(
        balances,
        (balance) => tokens.some((token) => token.dlt_id === balance.address)
      );

      return knownPrecisions.map((balance) => {
        const token = tokens.find((token) => token.dlt_id === balance.address)!;
        return [
          balance.address,
          shrinkToken(balance.weiBalance, token.decimals),
        ];
      });
    })
  );
