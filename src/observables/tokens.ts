import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ViewToken } from 'web3/types';
import { apiTokens$ } from './pools';
import { MinimalTokenListItem, tokenList$ } from './tokenList';

const tokenLogoOrDefault = (
  address: string,
  tokenList: MinimalTokenListItem[]
) => {
  const minimalToken = tokenList.find((token) => token.address === address);
  if (minimalToken) return minimalToken.logoURI;
  else return 'https://ropsten.etherscan.io/images/main/empty-token.png';
};

export const viewTokens$ = combineLatest([apiTokens$, tokenList$]).pipe(
  map(([apiTokens, tokenList]): ViewToken[] => {
    return apiTokens.map((token) => ({
      logoURI: tokenLogoOrDefault(token.dlt_id, tokenList),
      name: token.symbol,
      symbol: token.symbol,
    }));
  })
);
