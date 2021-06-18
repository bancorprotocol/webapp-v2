import { Subject } from 'rxjs';
import { distinctUntilChanged, startWith, shareReplay } from 'rxjs/operators';

const currentUserReceiver$ = new Subject<string>();
const chainIdReceiver$ = new Subject<number>();

const chainId$ = chainIdReceiver$.pipe(startWith(1));
const onLogoutReceiver$ = new Subject<boolean>();
const onLogout$ = onLogoutReceiver$.pipe(distinctUntilChanged());

export const currentUser$ = currentUserReceiver$.pipe(
  distinctUntilChanged(),
  shareReplay(1)
);

export const setChainId = (chainId: number | undefined) => {
  if (typeof chainId === 'number') {
    chainIdReceiver$.next(chainId);
  }
};

export const setUser = (userAddress: string | undefined | null) => {
  if (typeof userAddress === 'string') {
    currentUserReceiver$.next(userAddress);
  } else {
    onLogoutReceiver$.next(true);
  }
};