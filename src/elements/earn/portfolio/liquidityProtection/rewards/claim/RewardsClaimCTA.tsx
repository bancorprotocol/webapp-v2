import { StakeRewardsBtn } from 'elements/earn/portfolio/liquidityProtection/rewards/StakeRewardsBtn';
import { Tooltip } from 'components/tooltip/Tooltip';

export const RewardsClaimCTA = () => {
  const handleClaim = async () => {
    console.info(
      'Rewards were disabled as part of the V3 upgrade and will be available again shortly'
    );
  };

  return (
    <div className="flex justify-between ml-10 mr-10">
      <StakeRewardsBtn
        buttonLabel="Stake my Rewards"
        buttonClass="btn-primary rounded w-full mt-20"
      />
      <Tooltip
        content="Rewards were disabled as part of the V3 upgrade and will be available again shortly"
        button={
          <button
            onClick={() => handleClaim()}
            className="w-full mt-20 rounded btn-outline-primary"
            disabled
          >
            Withdraw Rewards
          </button>
        }
      />
    </div>
  );
};
