import { useBottomSheet } from '@gorhom/bottom-sheet';
import { PointCoreFragment } from '@whitewater-guide/schema';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { NavigateButton } from '~/components/NavigateButton';

const NAV_SCALE_IN: [number, number] = [-1, 0];
const NAV_SCALE_OUT: [number, number] = [0, 1];

interface SelectedPOIButtonsProps {
  poi?: PointCoreFragment | null;
}

const SelectedPOIButtons = memo<SelectedPOIButtonsProps>(({ poi }) => {
  const { animatedIndex } = useBottomSheet();
  const { t } = useTranslation();

  return (
    <NavigateButton
      label={t('commons:navigate')}
      point={poi}
      scaleValue={animatedIndex}
      scaleInput={NAV_SCALE_IN}
      scaleOutput={NAV_SCALE_OUT}
    />
  );
});

SelectedPOIButtons.displayName = 'SelectedPOIButtons';

export default SelectedPOIButtons;
