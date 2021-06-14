import { combineEpics } from 'redux-observable';
import { poolsEpic$ } from './pools';

export const rootEpic = combineEpics(poolsEpic$);
