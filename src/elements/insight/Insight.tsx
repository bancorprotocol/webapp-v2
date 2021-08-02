import { InsightRow } from './InsightRow';
import { ReactComponent as IconLightbulb } from 'assets/icons/lightbulb.svg';
import { ReactComponent as IconIntotheblock } from 'assets/icons/intotheblock.svg';
import { IntoTheBlock } from 'services/api/intoTheBlock';
import { ReactComponent as IconTimes } from 'assets/icons/times.svg';
import { useLocalStorage } from 'hooks/useLocalStorage';

export interface InsightToken extends IntoTheBlock {
  image: string;
  price: number;
}

export const Insight = ({ tokens }: { tokens: InsightToken[] }) => {
  const [isExpanded, setIsExpanded] = useLocalStorage(
    'insightsExpanded',
    false
  );

  console.log(tokens, 'are the tokens length');

  return (
    <div
      className={`widget-large mx-auto overflow-hidden transition-all duration-1000 ease-in-out ${
        isExpanded ? 'max-w-full h-[533px]' : 'w-[57px] h-[57px]'
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="flex justify-center items-center min-w-[57px] min-h-[57px]"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <IconLightbulb className="w-[17px] h-[24px]" />
          </button>
          <div className="text-20 font-semibold">Insights</div>
        </div>
        <div className="text-12 mr-20 flex items-center">
          <IconIntotheblock className="mr-6" />
          <span className="font-semibold">into</span>the
          <span className="font-semibold">block</span>
          <button className="w-16 ml-12">
            <IconTimes onClick={() => setIsExpanded(!isExpanded)} />
          </button>
        </div>
      </div>
      <div className="px-20">
        {tokens.map((token) => (
          <InsightRow key={token.symbol} token={token} />
        ))}
      </div>
    </div>
  );
};
