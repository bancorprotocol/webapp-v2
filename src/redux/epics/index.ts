import { combineEpics } from 'redux-observable';
import { poolsEpic$ } from './pools';
import { balancesEpic$ } from './balances';

export const rootEpic = combineEpics(poolsEpic$, balancesEpic$);
