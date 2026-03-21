import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import Icon from '~/components/Icon';
import { Swipeable } from '~/components/swipeable';
import theme from '~/theme';

import { ITEM_HEIGHT } from './constants';
import {
  SWIPEABLE_SECTION_TIP_BUTTON_WIDTH,
  SwipeableSectionTipButton,
} from './SwipeableSectionTipButton';

const styles = StyleSheet.create({
  swipeable: {
    width: theme.screenWidth,
    height: ITEM_HEIGHT,
    backgroundColor: theme.colors.lightBackground,
    flexDirection: 'row',
  },
  overlay: {
    height: ITEM_HEIGHT,
    width: theme.screenWidth,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.lightBackground,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  underlay: {
    width: theme.screenWidth,
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.primary,
  },
  text: {
    color: theme.colors.textMain,
  },
});

const SwipeableSectionTip = memo(() => {
  const { t } = useTranslation();

  const renderOverlay = () => (
    <>
      <Text style={styles.text}>
        {t('screens:region.sectionsList.swipeableTip')}
      </Text>
      <Icon
        icon="chevron-triple-left"
        color={theme.colors.textMain}
        size={16}
      />
    </>
  );

  const renderUnderlay = (position: SharedValue<number>) => (
    <SwipeableSectionTipButton position={position} />
  );

  return (
    <Swipeable
      snapPoint={-SWIPEABLE_SECTION_TIP_BUTTON_WIDTH}
      id="swipeable_tip"
      style={styles.swipeable}
      renderOverlay={renderOverlay}
      overlayStyle={styles.overlay}
      renderUnderlay={renderUnderlay}
      underlayStyle={styles.underlay}
    />
  );
});

SwipeableSectionTip.displayName = 'SwipeableSectionTip';

export default SwipeableSectionTip;
