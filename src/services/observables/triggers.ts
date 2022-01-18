import {
  tokenLists$,
  keeperDaoTokens$,
  tokens$,
  pools$,
  tokensNoBalance$,
  tokenListMerged$,
  poolTokens$,
} from 'services/observables/tokens';
import {
  setAllTokens,
  setBntPrice,
  setKeeperDaoTokens,
  setTokenList,
  setTokenLists,
} from 'redux/bancor/bancor';
import { take } from 'rxjs/operators';
import {
  loadingBalances$,
  loadingLockedBnt$,
  loadingPositions$,
  loadingRewards$,
} from './user';
import { setLoadingBalances } from 'redux/user/user';
import { statistics$ } from 'services/observables/statistics';
import { setPools, setStats } from 'redux/bancor/pool';
import { bntPrice$ } from 'services/observables/bancor';
import {
  setLoadingLockedBnt,
  setLoadingPositions,
  setLoadingRewards,
  setLockedAvailableBNT,
  setPoolTokens,
  setProtectedPositions,
  setRewards,
} from 'redux/liquidity/liquidity';
import {
  lockedAvailableBnt$,
  protectedPositions$,
  rewards$,
} from './liquidity';
import { apiData$ } from './pools';
import { setAPIData, setIsApiDataLoaded } from 'redux/bancor2/apiData.slice';
import {
  ITokenList,
  setIsTokenListDataLoaded,
  setTokenListData,
} from 'redux/bancor2/tokenLists.slice';
import { setBalances } from 'redux/bancor2/userData.slice';

export const subscribeToObservables = (dispatch: any) => {
  apiData$.subscribe((apiData) => {
    dispatch(setAPIData(apiData));
    dispatch(setIsApiDataLoaded(true));
    dispatch(setBalances());
  });

  tokenLists$.subscribe((tokenLists) => {
    dispatch(setTokenLists(tokenLists));
    dispatch(setTokenListData(tokenLists as ITokenList[]));
    dispatch(setIsTokenListDataLoaded(true));
  });

  tokensNoBalance$
    .pipe(take(1))
    .toPromise()
    .then((tokenList) => dispatch(setTokenList(tokenList)));

  loadingBalances$.subscribe((loading) =>
    dispatch(setLoadingBalances(loading))
  );

  tokens$.subscribe((tokenList) => {
    dispatch(setTokenList(tokenList));
  });

  tokenListMerged$.subscribe((tokenList) => {
    dispatch(setAllTokens(tokenList));
  });

  keeperDaoTokens$.subscribe((keeperDaoTokens) => {
    dispatch(setKeeperDaoTokens(keeperDaoTokens));
  });

  pools$.subscribe((pools) => {
    dispatch(setPools(pools));
  });

  statistics$.subscribe((stats) => {
    dispatch(setStats(stats));
  });

  bntPrice$.subscribe((bntPrice) => {
    dispatch(setBntPrice(bntPrice));
  });

  protectedPositions$.subscribe((protectedPositions) => {
    dispatch(setProtectedPositions(protectedPositions));
  });

  rewards$.subscribe((rewards) => {
    dispatch(setRewards(rewards));
  });

  poolTokens$.subscribe((poolTokens) => dispatch(setPoolTokens(poolTokens)));

  lockedAvailableBnt$.subscribe((lockedAvailableBnt) => {
    if (lockedAvailableBnt) {
      dispatch(setLockedAvailableBNT(lockedAvailableBnt));
    }
  });

  loadingPositions$.subscribe((loadingPositions) =>
    dispatch(setLoadingPositions(loadingPositions))
  );
  loadingRewards$.subscribe((loadingRewards) =>
    dispatch(setLoadingRewards(loadingRewards))
  );
  loadingLockedBnt$.subscribe((loadingLockedBnt) =>
    dispatch(setLoadingLockedBnt(loadingLockedBnt))
  );
};
