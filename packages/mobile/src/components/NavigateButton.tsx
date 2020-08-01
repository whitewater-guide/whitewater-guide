import { Point } from '@whitewater-guide/commons';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import theme from '../theme';
import { openGoogleMaps } from '../utils/maps';
import Icon from './Icon';

export const NAVIGATE_BUTTON_HEIGHT = 72;
export const NAVIGATE_BUTTON_WIDTH = 64;

const styles = StyleSheet.create({
  button: {
    width: NAVIGATE_BUTTON_WIDTH,
    height: NAVIGATE_BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textMain,
  },
});

interface Props {
  labelKey: string;
  point?: Point | null;
  premiumGuard: () => boolean;
  scale?: Animated.Node<number>;
}

export const NavigateButton: React.FC<Props> = React.memo((props) => {
  const {
    labelKey,
    point,
    premiumGuard,
    scale = new Animated.Value(1),
  } = props;
  const { t } = useTranslation();
  const onTouch = useCallback(() => {
    if (point && premiumGuard()) {
      openGoogleMaps(point.coordinates, point.name).catch(() => {});
    }
  }, [point, premiumGuard]);
  return (
    <RectButton onPress={onTouch} style={styles.button}>
      <Animated.View
        style={[styles.wrapper, { transform: [{ scale }] } as any]}
      >
        <Icon icon="car" size={28} />
        <Text style={styles.label}>{t(labelKey)}</Text>
      </Animated.View>
    </RectButton>
  );
});

NavigateButton.displayName = 'NavigateButton';
