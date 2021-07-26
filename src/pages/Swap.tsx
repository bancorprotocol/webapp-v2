import { SwapLimitTable } from 'elements/swapLimit/SwapLimitTable';
import { SwapWidget } from 'elements/swapWidget/SwapWidget';
import { useState } from 'react';

export const Swap = () => {
  const [isLimit, setIsLimit] = useState(false);

  return (
    <>
      <SwapWidget isLimit={isLimit} setIsLimit={setIsLimit} />
      {isLimit ? <SwapLimitTable /> : ''}
    </>
  );
};
