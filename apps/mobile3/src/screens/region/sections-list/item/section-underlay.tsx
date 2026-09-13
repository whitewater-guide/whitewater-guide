import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import {
  Extrapolation,
  interpolate,
  useDerivedValue,
} from 'react-native-reanimated';

import NavigateButton, {
  NAVIGATE_BUTTON_WIDTH,
} from '@/components/navigate-button';
import { useTheme } from '@/hooks/use-theme';

import { ITEM_HEIGHT } from './constants';
import FavoriteButton from './favorite-button';
import type { ListedSection } from './types';

const PUT_IN_SCALE_IN: [number, number] = [
  -2 * NAVIGATE_BUTTON_WIDTH,
  -NAVIGATE_BUTTON_WIDTH,
];
const PUT_IN_SCALE_OUT: [number, number] = [1, 0];
const TAKE_OUT_SCALE_IN: [number, number] = [-NAVIGATE_BUTTON_WIDTH, 0];
const TAKE_OUT_SCALE_OUT: [number, number] = [1, 0];

export interface SectionUnderlayProps {
  section: ListedSection;
  position: SharedValue<number>;
}

function SectionUnderlay({ section, position }: SectionUnderlayProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const scaleFav = useDerivedValue(() =>
    interpolate(
      position.value,
      [-3 * NAVIGATE_BUTTON_WIDTH, -2 * NAVIGATE_BUTTON_WIDTH],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default memo(SectionUnderlay);
