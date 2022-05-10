import { useState } from 'react';
import { useAppSelector } from 'redux/index';
import { Pool } from 'services/observables/tokens';
import { getProtectedPools } from 'redux/bancor/pool';
import { SelectPoolModal } from 'components/selectPoolModal/SelectPoolModal';
import { useNavigation } from 'services/router';
import { Tooltip } from 'components/tooltip/Tooltip';

interface Props {
  buttonLabel: string;
  buttonClass: string;
  posGroupId?: string;
}

export const StakeRewardsBtn = ({
  buttonClass,
  buttonLabel,
  posGroupId,
}: Props) => {
  const { pushRewardsStakeByID, pushRewardsStakeByIDnPos } = useNavigation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pools = useAppSelector<Pool[]>(getProtectedPools);

  const onSelect = (pool: Pool) => {
    if (posGroupId) pushRewardsStakeByIDnPos(pool.pool_dlt_id, posGroupId);
    else pushRewardsStakeByID(pool.pool_dlt_id);
  };

  const handleOpenClose = (open: boolean) => {
    if (open) {
      console.info(
        'Rewards were disabled as part of the V3 upgrade and will be available again shortly'
      );
      return;
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <SelectPoolModal
        pools={pools}
        isOpen={isModalOpen}
        setIsOpen={handleOpenClose}
        onSelect={onSelect}
      />
      <Tooltip
        content="Rewards were disabled as part of the V3 upgrade and will be available again shortly"
        button={
          <button onClick={() => handleOpenClose(true)} className={buttonClass} disabled>
            {buttonLabel}
          </button>
        }
      />
    </>
  );
};
