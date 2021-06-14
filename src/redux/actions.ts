import { Pool, Token } from 'api/bancor';
import { createAsyncAction } from 'typesafe-actions';

const createActions = <T, Y>(modelName: string) => {
  const base = `FETCH_${modelName.toUpperCase()}_`;

  const x = createAsyncAction(
    base + 'REQUEST',
    base + 'SUCCESS',
    base + 'FAILURE',
    base + 'CANCEL'
  )<T, Y>();

  return x;
};

export const poolActions = createActions<undefined, Pool[]>('pools');
export const tokenActions = createActions<undefined, Token[]>('tokens');
export const balanceActions =
  createActions<string[], [string, string][]>('balances');
