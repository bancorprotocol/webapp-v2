import { createContext, useEffect, useState } from 'react';
import { SwapHeader } from 'elements/swapHeader/SwapHeader';
import { SwapMarket } from 'elements/swapMarket/SwapMarket';
import { SwapLimit } from 'elements/swapLimit/SwapLimit';
import { loadSwapData } from 'services/observables/triggers';
import { useDispatch } from 'react-redux';
import { Token } from 'services/observables/tokens';
import { useAppSelector } from 'redux/index';
import { ethToken, wethToken } from 'services/web3/config';
import {
  fetchFromToken,
  fetchToToken,
} from 'services/observables/intoTheBlock';
import { Insight, InsightToken } from 'elements/insight/Insight';
import { IntoTheBlock } from 'services/api/intoTheBlock';
import { zip } from 'lodash';
import { ReactComponent as IconLightbulb } from 'assets/icons/lightbulb.svg';

export const Toggle = createContext(false);
interface SwapWidgetProps {
  isLimit: boolean;
  setIsLimit: Function;
}

export const SwapWidget = ({ isLimit, setIsLimit }: SwapWidgetProps) => {
  const tokens = useAppSelector<Token[]>((state) => state.bancor.tokens);
  const fromTokenIntoBlock = useAppSelector<IntoTheBlock>(
    (state) => state.intoTheBlock.fromToken
  );
  const toTokenIntoBlock = useAppSelector<IntoTheBlock>(
    (state) => state.intoTheBlock.toToken
  );

  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [toggle, setToggle] = useState(false);

  const [showInsights, setShowInsights] = useState(false);

  const insightTokens = zip(
    [fromTokenIntoBlock, toTokenIntoBlock],
    [fromToken, toToken]
  )
    .filter(([intoTheBlock, api]) => api && intoTheBlock && api.logoURI)
    .map(
      ([intoTheBlock, api]): InsightToken =>
        ({
          ...intoTheBlock,
          price: Number(api?.usdPrice) || 0,
          image: api?.logoURI || '',
        } as InsightToken)
    );

  const dispatch = useDispatch();

  useEffect(() => {
    loadSwapData(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (fromToken) {
      fetchFromToken(fromToken.symbol);
    }
  }, [fromToken]);

  useEffect(() => {
    if (toToken) {
      fetchToToken(toToken.symbol);
    }
  }, [toToken]);

  useEffect(() => {
    const findSetToken = (token: Token) => {
      if (token) {
        const found = tokens.find((x) => x.address === token.address);
        if (found) return found;
      }

      return null;
    };
    const foundFrom = findSetToken(fromToken);
    foundFrom ? setFromToken(foundFrom) : setFromToken(tokens[0]);

    if (
      toToken &&
      fromToken &&
      fromToken.address !== wethToken &&
      toToken.address !== ethToken
    ) {
      const foundTo = findSetToken(toToken);
      foundTo ? setToToken(foundTo) : setToToken(tokens[1]);
    }
  }, [tokens, fromToken, toToken]);

  const switchTokens = () => {
    if (toToken) {
      setFromToken(toToken);
      setToToken(fromToken);
    }
  };

  return (
    <Toggle.Provider value={toggle}>
      <div className="flex  w-[1215px] mx-auto space-x-20">
        <div>
          <div className="widget">
            <SwapHeader
              isLimit={isLimit}
              setIsLimit={setIsLimit}
              setToggle={setToggle}
            />
            <hr className="widget-separator" />
            {isLimit ? (
              <SwapLimit
                fromToken={fromToken}
                setFromToken={setFromToken}
                toToken={toToken}
                setToToken={setToToken}
                switchTokens={switchTokens}
              />
            ) : (
              <SwapMarket
                fromToken={fromToken}
                setFromToken={setFromToken}
                toToken={toToken}
                setToToken={setToToken}
                switchTokens={switchTokens}
              />
            )}
          </div>
          {isLimit ? (
            <div className="text-center text-10 text-grey-4 mt-18">
              Limit orders are powered by KeeperDAO
            </div>
          ) : (
            ''
          )}
        </div>
        {showInsights ? (
          <Insight
            tokens={insightTokens}
            onClose={() => setShowInsights(false)}
          />
        ) : (
          <div>
            <div className="w-40 h-40 p-30 mx-4 rounded rounded-2xl bg-white ">
              <IconLightbulb
                className="w-[28px] h-[23px] dark:text-grey-4"
                onClick={() => setShowInsights(true)}
              />
            </div>
          </div>
        )}
      </div>
    </Toggle.Provider>
  );
};
