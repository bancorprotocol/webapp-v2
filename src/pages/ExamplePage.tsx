import { useAppSelector } from '../redux';
import {
  getAllTokens,
  getAllTokensByTL,
} from '../redux/bancor2/tokens.selector';
import { Image } from '../components/image/Image';
import { orderBy } from 'lodash';
import {
  setSelectedTokenList,
  TokenListName,
} from '../redux/bancor2/tokenLists.slice';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../redux/bancor2/userData.slice';

export const ExamplePage = () => {
  const dispatch = useDispatch();

  const tokens = useAppSelector(getAllTokensByTL);
  const allTokens = useAppSelector(getAllTokens);

  const selectedList = useAppSelector<TokenListName>(
    (state) => state.tokenLists.selectedTokenList
  );
  const selectTokenList = (name: TokenListName) => {
    dispatch(setSelectedTokenList(name));
  };

  const mockLogin = (mockUser?: string) => {
    dispatch(setCurrentUser(mockUser));
  };

  return (
    <div>
      <div className="flex space-x-16">
        <button
          className="btn btn-sm btn-success"
          onClick={() => mockLogin('mockuser')}
        >
          Login
        </button>
        <button className="btn btn-sm btn-error" onClick={() => mockLogin()}>
          Logout
        </button>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => selectTokenList('1inch')}
        >
          1inch
        </button>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => selectTokenList('CoinGecko')}
        >
          CoinGecko
        </button>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => selectTokenList('Defiprime')}
        >
          DefiPrime
        </button>
      </div>

      <div className="grid grid-cols-3">
        <h2>
          Selected List:{' '}
          <span className="text-primary uppercase">
            {selectedList || 'no list selected'}
          </span>
        </h2>
        <h2>All Tokens</h2>
        <h3>more tokens</h3>
      </div>
      <div className="grid grid-cols-3">
        {[tokens, allTokens].map((data, index) => (
          <div className="space-y-20" key={index}>
            <h2>Token Count: {data.length}</h2>
            {orderBy(data, ['balance', 'symbol'], ['desc', 'asc']).map(
              (token, index) => (
                <div key={index} className="flex items-center">
                  {index + 1}.
                  <Image
                    alt={'something'}
                    src={token.logoURI.replace('thumb', 'large')}
                    className={'w-[52px] h-[52px] rounded-full mx-10'}
                  />
                  <div>
                    <div className="text-16 font-semibold">{token.symbol} </div>
                    <div className="opacity-50 font-normal text-14">
                      {token.name}
                    </div>
                    <div className="opacity-50 font-normal text-14">
                      {token.address}
                    </div>
                    {token.balance ? (
                      <div>Balance: {token.balance}</div>
                    ) : (
                      <div className="opacity-0">Balance: {token.balance}</div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
