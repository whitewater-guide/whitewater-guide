import { useBottomSheet } from '@gorhom/bottom-sheet';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import NavigateButton from '@/components/navigate-button';

import type { MapSection } from '../types';

const NAV_SCALE_IN: [number, number] = [-1, 0];
const NAV_SCALE_OUT: [number, number] = [0, 1];

export interface SelectedSectionButtonsProps {
  section?: MapSection | null;
}

function SelectedSectionButtons({ section }: SelectedSectionButtonsProps) {
  const { animatedIndex } = useBottomSheet();
  const { t } = useTranslation();
  return (
    <>
      <NavigateButton
        label={t('commons:putIn')}
        point={section?.putIn}
        scaleValue={animatedIndex}
        scaleInput={NAV_SCALE_IN}
        scaleOutput={NAV_SCALE_OUT}
      />
      <NavigateButton
        label={t('commons:takeOut')}
        point={section?.takeOut}
        scaleValue={animatedIndex}
        scaleInput={NAV_SCALE_IN}
        scaleOutput={NAV_SCALE_OUT}
      />
    </>
  );
}

export default memo(SelectedSectionButtons);
