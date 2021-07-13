import { useEffect } from 'react';
import 'elements/intoTheBlock/intoTheBlock.css';

export const IntoTheBlock = () => {
  const into_the_block = 'into_the_block';
  const url = 'https://app.intotheblock.com/widget.js';

  useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.type = 'text/javascript';
    script.onload = () => {
      //@ts-ignore
      window.itbWidgetInit({
        apiKey: 'i5Ns7HzXr9hIbPMfChi24ydoqQCdLBK2Rix0JwMg',
        language: 'en',
        options: {
          tokenId: 'BNT',
          loader: true,
          hideCallToAction: true,
          signalsV2: {
            colors: {
              neutral: '#bdc3c7',
              bearish: '#FD7272',
              bullish: '#3ae374',
            },
          },
          tokenSummary: {
            showHoldersMakingMoneyAtCurrentPrice: true,
            showConcentrationByLargeHolders: true,
            showHoldersCompositionByTimeHeld: true,
            showPriceCorrelationWithBitcoin: false,
            showTransactionsGreaterThan100K: false,
            showTransactionDemographics: false,
            showTelegramMembersChange: false,
            showVolatility: false,
            showTotalExchangesInflow: false,
            showTotalExchangesOutflow: false,
          },
        },
      });
    };

    document.getElementById('total-exchanges-inflows')?.remove();
    document.getElementById('total-exchanges-outflows')?.remove();
    const signals = document.getElementsByClassName(
      'signals-content sc-bwzfXH icICro'
    );
    if (signals && signals.length > 0) signals[0].remove();
    const actions = document.getElementsByClassName('actions');
    if (actions && actions.length > 0) actions[0].remove();

    const element = document.getElementById(into_the_block);
    if (element) element.appendChild(script);

    return () => {
      if (element) element.removeChild(script);
    };
  }, []);

  return (
    <div id={into_the_block}>
      <div className="widget-container">
        <div data-target="itb-widget" data-type="quick-view-v2"></div>
      </div>
    </div>
  );
};
