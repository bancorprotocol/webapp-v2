import { SwapWidget } from 'elements/trade/swap/swapWidget/SwapWidget';
import { useState } from 'react';
import { SwapLimitTable } from 'elements/trade/swap/swapLimit/SwapLimitTable';

export const Swap = () => {
  const [isLimit, setIsLimit] = useState(false);

  return (
    <div className="md:pt-[55px]">
      <SwapWidget isLimit={isLimit} setIsLimit={setIsLimit} />
      {isLimit ? <SwapLimitTable /> : ''}
    </div>
  );
};
