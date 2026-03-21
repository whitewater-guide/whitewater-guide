import { useBottomSheet } from '@gorhom/bottom-sheet';
import type { ListedSectionFragment } from '@whitewater-guide/clients';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { NavigateButton } from '../../NavigateButton';

const NAV_SCALE_IN: [number, number] = [-1, 0];
const NAV_SCALE_OUT: [number, number] = [0, 1];

interface SelectedSectionButtonsProps {
  section?: ListedSectionFragment | null;
}

const SelectedSectionButtons = memo<SelectedSectionButtonsProps>(
  ({ section }) => {
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
  },
);

SelectedSectionButtons.displayName = 'SelectedSectionButtons';

export default SelectedSectionButtons;
