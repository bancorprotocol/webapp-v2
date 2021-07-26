import { InsightRow } from './InsightRow';
import { ReactComponent as IconLightbulb } from 'assets/icons/lightbulb.svg';
import { ReactComponent as IconIntotheblock } from 'assets/icons/intotheblock.svg';

export const Insight = () => {
  return (
    <div className="widget-large  mx-auto">
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
      <InsightRow
        imageUri="https://storage.googleapis.com/bancor-prod-file-store/images/communities/aea83e97-13a3-4fe7-b682-b2a82299cdf2.png"
        tokenSymbol="BNT"
      />
      <InsightRow
        imageUri="https://storage.googleapis.com/bancor-prod-file-store/images/communities/aea83e97-13a3-4fe7-b682-b2a82299cdf2.png"
        tokenSymbol="BNT"
      />
    </div>
  );
};
