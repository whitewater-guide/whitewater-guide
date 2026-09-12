import { useBottomSheet } from '@gorhom/bottom-sheet';
import type { PointCoreFragment } from '@whitewater-guide/schema';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import NavigateButton from '@/components/navigate-button';

const NAV_SCALE_IN: [number, number] = [-1, 0];
const NAV_SCALE_OUT: [number, number] = [0, 1];

export interface SelectedPOIButtonsProps {
  poi?: PointCoreFragment | null;
}

const SelectedPOIButtons = memo(({ poi }: SelectedPOIButtonsProps) => {
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
