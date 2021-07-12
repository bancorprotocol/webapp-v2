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
        },
      });
    };
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
