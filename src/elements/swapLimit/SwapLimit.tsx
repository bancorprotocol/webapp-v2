import { TokenInputField } from 'components/tokenInputField/TokenInputField';
import { balances$ } from 'observables/balances';
import { apiTokens$ } from 'observables/pools';

export const SwapLimit = () => {
  return <h1>toFix</h1>;
  const tokens = [];
  const balances = [];

  if (tokens.length == 0) {
    return <p>Loading..</p>;
  }

  const fromToken = tokens[0];
  const toToken = tokens[3];

  return (
    <div>
      <div className="px-20">
        <TokenInputField
          label="You Pay"
          balance={Number(balances[fromToken.dlt_id] || 0)}
          balanceUsd={98.76}
          border
          initialToken={fromToken}
        />
      </div>

      <div className="widget-block mt-20">
        <div className="mx-10 mb-16">
          <TokenInputField
            label="You Receive"
            balance={Number(balances[toToken.dlt_id] || 0)}
            balanceUsd={98.76}
            initialToken={toToken}
          />

          <div className="flex justify-between mt-15">
            <span>Rate</span>
            <span>1 BNT = 0.00155432 ETH</span>
          </div>

          <div className="flex justify-between">
            <span>Price Impact</span>
            <span>0.2000%</span>
          </div>
        </div>

        <button className="btn-primary rounded w-full">Swap Limit</button>
      </div>
    </div>
  );
};
