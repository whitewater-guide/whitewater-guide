import React, { FC, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Subheading } from 'react-native-paper';
import Reanimated from 'react-native-reanimated';

import Icon from '~/components/Icon';
import { NAVIGATE_BUTTON_HEIGHT } from '~/components/NavigateButton';
import theme from '~/theme';

import { runAnimation } from './animations';
import {
  SWIPEABLE_SECTION_TIP_BUTTON_WIDTH,
  SwipeableSectionTipButton,
} from './SwipeableSectionTipButton';

const styles = StyleSheet.create({
  container: {
    width: theme.screenWidth,
    height: NAVIGATE_BUTTON_HEIGHT,
    backgroundColor: theme.colors.lightBackground,
  },
  right: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: NAVIGATE_BUTTON_HEIGHT,
    backgroundColor: theme.colors.primary,
    right: 0,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    width: theme.screenWidth,
    height: NAVIGATE_BUTTON_HEIGHT,
    backgroundColor: theme.colors.lightBackground,
    paddingHorizontal: theme.margin.double,
    justifyContent: 'space-between',
  },
});

const activeOffsetX = [-15, 15];
const activeOffsetY = [-10000, 10000];
const failOffsetY = [-15, 15];

interface Props {
  swipedId: string;
  onSwipe?: (id: string) => void;
}

const SwipeableSectionTip: FC<Props> = ({ onSwipe, swipedId }) => {
  const { t } = useTranslation();
  const animation = useRef(
    runAnimation(-SWIPEABLE_SECTION_TIP_BUTTON_WIDTH, () =>
      onSwipe?.('SwipeableSectionTipItem'),
    ),
  ).current;

  const scale = useRef(
    Reanimated.interpolate(animation.position, {
      inputRange: [-SWIPEABLE_SECTION_TIP_BUTTON_WIDTH, 0],
      outputRange: [1, 0],
      extrapolate: Reanimated.Extrapolate.CLAMP,
    }),
  ).current;

  useEffect(() => {
    if (swipedId !== 'SwipeableSectionTipItem') {
      animation.close();
    }
  }, [swipedId, animation]);

  return (
    <View style={styles.container}>
      <View style={styles.right}>
        <SwipeableSectionTipButton scale={scale} onSwipe={onSwipe} />
      </View>

      <Reanimated.Code exec={animation.watchOnOpen} />

      <PanGestureHandler
        minDist={20}
        activeOffsetX={activeOffsetX}
        activeOffsetY={activeOffsetY}
        failOffsetY={failOffsetY}
        onGestureEvent={animation.gestureHandler}
        onHandlerStateChange={animation.gestureHandler}
      >
        <Reanimated.View
          style={{
            transform: [{ translateX: animation.position }],
          }}
        >
          <View style={styles.body}>
            <Subheading>
              {t('screens:region.sectionsList.swipeableTip')}
            </Subheading>
            <Icon icon="chevron-triple-left" color={theme.colors.textMain} />
          </View>
        </Reanimated.View>
      </PanGestureHandler>
    </View>
  );
};

export default SwipeableSectionTip;
