import { ListedSectionFragment } from '@whitewater-guide/clients';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Extrapolation,
  interpolate,
  SharedValue,
  useDerivedValue,
} from 'react-native-reanimated';

import {
  NAVIGATE_BUTTON_WIDTH,
  NavigateButton,
} from '~/components/NavigateButton';

import FavoriteButton from './FavoriteButton';

const PUT_IN_SCALE_IN: [number, number] = [
  -2 * NAVIGATE_BUTTON_WIDTH,
  -NAVIGATE_BUTTON_WIDTH,
];
const PUT_IN_SCALE_OUT: [number, number] = [1, 0];
const TAKE_OUT_SCALE_IN: [number, number] = [-NAVIGATE_BUTTON_WIDTH, 0];
const TAKE_OUT_SCALE_OUT: [number, number] = [1, 0];

interface SectionUnderlayProps {
  section: ListedSectionFragment;
  position: SharedValue<number>;
}

const SectionUnderlay: FC<SectionUnderlayProps> = ({ position, section }) => {
  const { t } = useTranslation();

  const scaleFav = useDerivedValue(() =>
    interpolate(
      position.value,
      [-3 * NAVIGATE_BUTTON_WIDTH, -2 * NAVIGATE_BUTTON_WIDTH],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  );

  return (
    <>
      <FavoriteButton
        sectionId={section.id}
        favorite={section.favorite}
        scale={scaleFav}
      />
      <NavigateButton
        label={t('commons:putIn')}
        point={section.putIn}
        scaleValue={position}
        scaleInput={PUT_IN_SCALE_IN}
        scaleOutput={PUT_IN_SCALE_OUT}
      />
      <NavigateButton
        label={t('commons:takeOut')}
        point={section.takeOut}
        scaleValue={position}
        scaleInput={TAKE_OUT_SCALE_IN}
        scaleOutput={TAKE_OUT_SCALE_OUT}
      />
    </>
  );
};

SectionUnderlay.displayName = 'SectionUnderlay';

export default SectionUnderlay;
