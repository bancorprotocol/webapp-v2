import { prettifyNumber } from 'utils/helperFunctions';
import { useMyRewards } from 'elements/earn/portfolio/liquidityProtection/rewards/useMyRewards';
import { StakeRewardsBtn } from 'elements/earn/portfolio/liquidityProtection/rewards/StakeRewardsBtn';
import { useAppSelector } from 'redux/index';
import { Tooltip } from 'components/tooltip/Tooltip';

export const MyRewards = () => {
  const [totalRewards, totalRewardsUsd, claimableRewards, claimableRewardsUsd] =
    useMyRewards();
  const loading = useAppSelector<boolean>(
    (state) => state.liquidity.loadingRewards
  );

  return (
    <section className="content-section py-20 border-l-[10px] border-primary-light">
      <div className="flex items-center justify-between">
        <h2 className="ml-[20px] md:ml-[33px]">Rewards</h2>
        <div className="flex mr-[20px] md:mr-[44px] space-x-8">
          <Tooltip
            content="Rewards were disabled as part of the V3 upgrade and will be available again shortly"
            button={
              <button
                onClick={() => {}}
                className="btn-outline-primary btn-sm rounded-[12px]"
                disabled
              >
                Claim
              </button>
            }
          />
          <StakeRewardsBtn
            buttonLabel="Stake"
            buttonClass="btn-primary btn-sm rounded-[12px]"
          />
        </div>
      </div>
      <hr className="content-separator my-14 mx-[20px] md:ml-[34px] md:mr-[44px]" />
      <div className="flex justify-between items-center h-44 md:ml-[34px] md:mr-[44px] mx-15">
        {loading ? (
          <div className="loading-skeleton h-20 w-[120px] md:w-[200px]"></div>
        ) : (
          <div>
            <div className="mb-5">Total Rewards to Date</div>
            {totalRewards && totalRewardsUsd ? (
              <div>
                <span className="mr-5 font-semibold md:text-16">
                  {prettifyNumber(totalRewards)} BNT
                </span>
                <span className="text-12 text-primary dark:text-primary-light">
                  (~
                  {prettifyNumber(totalRewardsUsd, true)})
                </span>
              </div>
            ) : (
              <div>
                <span className="mr-5 font-semibold md:text-16 text-primary dark:text-primary-light">
                  --
                </span>
              </div>
            )}
          </div>
        )}
        {loading ? (
          <div className="loading-skeleton h-20 w-[120px] md:w-[200px]"></div>
        ) : (
          <div>
            <div className="mb-5">Claimable Rewards</div>
            {claimableRewards && claimableRewardsUsd ? (
              <div>
                <span className="mr-5 font-semibold md:text-16">
                  {prettifyNumber(claimableRewards)} BNT
                </span>
                <span className="text-12 text-primary dark:text-primary-light">
                  (~
                  {prettifyNumber(claimableRewardsUsd, true)})
                </span>
              </div>
            ) : (
              <div>
                <span className="mr-5 font-semibold md:text-16 text-primary dark:text-primary-light">
                  --
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
