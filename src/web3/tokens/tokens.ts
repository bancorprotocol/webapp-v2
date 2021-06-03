import { TokenList } from 'api/keeperDao';
import axios, { AxiosResponse } from 'axios';

const COINGECKO_LIST = 'https://tokens.coingecko.com/uniswap/all.json';

export const TOKEN_LIST_OF_LISTS: string[] = [COINGECKO_LIST];

export const getListOfLists = async (): Promise<TokenList[]> => {
  return await axios
    .all<AxiosResponse<any>>(TOKEN_LIST_OF_LISTS.map((url) => axios.get(url)))
    .then(
      axios.spread((...responses) => {
        const list = responses.map<TokenList>((res) => {
          return res.data;
        });
        return list;
      })
    )
    .catch((error) => {
      console.error(error);
      return <TokenList[]>[];
    });
};
