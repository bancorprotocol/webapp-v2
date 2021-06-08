import { fromPairs } from 'lodash';
import { Subject } from 'rxjs';
import { mergeMap, scan, shareReplay } from 'rxjs/operators';
import { toChecksumAddress } from 'web3-utils';

interface BalanceDictionary {
  [address: string]: string;
}

export const balanceReceiver$ = new Subject<string[]>();

const balanceFetcher = async (
  addresses: string[]
): Promise<[address: string, balance: string][]> => {
  return addresses.map((address) => [address, '4.6871']);
};

export const balances$ = balanceReceiver$.pipe(
  mergeMap((balances) => balanceFetcher(balances)),
  scan((acc, balances): BalanceDictionary => {
    const newBalances = fromPairs(balances);

    return {
      ...acc,
      ...newBalances,
    };
  }, {} as BalanceDictionary),
  shareReplay(1)
);

export const balance = {
  fetchBalances: function (balances: string[]) {
    balanceReceiver$.next(balances.map(toChecksumAddress));
  },
};
