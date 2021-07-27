import { InsightRow } from './InsightRow';
import { ReactComponent as IconLightbulb } from 'assets/icons/lightbulb.svg';
import { ReactComponent as IconIntotheblock } from 'assets/icons/intotheblock.svg';
import { IntoTheBlock } from 'services/api/intoTheBlock';

export interface InsightToken extends IntoTheBlock {
  image: string;
  price: number;
}

export const Insight = ({ tokens }: { tokens: InsightToken[] }) => (
  <div className="widget-large mx-auto">
    <div className="flex justify-between p-10">
      <div className="text-2xl  font-semibold flex gap-10">
        <IconLightbulb /> Insights
      </div>
      <div className="text-sm flex ">
        <IconIntotheblock className="mr-6" />
        <span className="font-bold">into</span>the
        <span className="font-bold">block</span>
      </div>
    </div>
    {tokens.map((token) => (
      <InsightRow key={token.symbol} token={token} />
    ))}
  </div>
);
