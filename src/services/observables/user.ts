import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, shareReplay } from 'rxjs/operators';

const userReceiver$ = new BehaviorSubject<string>('');

export const user$ = userReceiver$.pipe(distinctUntilChanged(), shareReplay(1));

export const onLogin$ = user$.pipe(
  filter<string>(Boolean),
  distinctUntilChanged(),
  shareReplay(1)
);

export const setUser = (userAddress: string | undefined | null) => {
  if (typeof userAddress === 'string') {
    userReceiver$.next(userAddress);
  } else {
    userReceiver$.next('');
  }
};
