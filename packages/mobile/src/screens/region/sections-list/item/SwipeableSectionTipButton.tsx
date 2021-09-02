import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import Animated from 'react-native-reanimated';

import { NAVIGATE_BUTTON_HEIGHT } from '~/components/NavigateButton';
import { useAppSettings } from '~/features/settings';
import theme from '~/theme';

export const SWIPEABLE_SECTION_TIP_BUTTON_WIDTH = 100;

const styles = StyleSheet.create({
  container: {
    width: SWIPEABLE_SECTION_TIP_BUTTON_WIDTH,
    height: NAVIGATE_BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    backgroundColor: 'red',
  },
});

interface Props {
  scale: Animated.Node<number>;
  onSwipe?: (id: string) => void;
}

export const SwipeableSectionTipButton: FC<Props> = ({ scale, onSwipe }) => {
  const { t } = useTranslation();
  const { updateSettings } = useAppSettings();

  const onClose = useCallback(() => {
    // update after closing animation
    onSwipe?.('');
    setTimeout(() => {
      updateSettings({ seenSwipeableSectionTip: true });
    }, 200);
  }, [updateSettings, onSwipe]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Button mode="text" color={theme.colors.textLight} onPress={onClose}>
          {t('commons:close')}
        </Button>
      </Animated.View>
    </View>
  );
};
