import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Image from 'react-native-fast-image';
import { Caption } from 'react-native-paper';
import {
  PIN_HEIGHT,
  PIN_WIDTH,
  PUT_IN_PIN,
  TAKE_OUT_PIN,
} from '../../../assets';
import theme from '../../../theme';

const CROSS = 48;
const THICKNESS = StyleSheet.hairlineWidth;

const styles = StyleSheet.create({
  visible: {
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  cross: {
    position: 'absolute',
    backgroundColor: theme.colors.lightBackground,
  },
  pin: {
    position: 'absolute',
    width: PIN_WIDTH,
    height: PIN_HEIGHT,
  },
  ctaWrapper: {
    position: 'absolute',
    top: theme.margin.single,
    left: 48,
    width: theme.screenWidth - 96,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: theme.rounding.single,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: theme.colors.textLight,
  },
});

interface Props {
  selected: -1 | 0 | 1;
  moving: boolean;
}

interface Positions {
  vert: {
    top: number;
    left: number;
    height: number;
    width: number;
  };
  hor: {
    top: number;
    left: number;
    height: number;
    width: number;
  };
  pin: {
    top: number;
    left: number;
  };
}

const PiToOverlay: React.FC<Props> = React.memo(({ selected, moving }) => {
  const { t } = useTranslation();
  const [positions, setPositions] = useState<Positions | undefined>();
  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      setPositions({
        vert: {
          top: (height - CROSS) / 2,
          left: (width - THICKNESS) / 2,
          height: CROSS,
          width: THICKNESS,
        },
        hor: {
          top: (height - THICKNESS) / 2,
          left: (width - CROSS) / 2,
          width: CROSS,
          height: THICKNESS,
        },
        pin: {
          top: height / 2 - PIN_HEIGHT,
          left: width / 2 - PIN_WIDTH / 2,
        },
      });
    },
    [setPositions],
  );
  const visible = selected !== -1;
  const [moved, setMoved] = useState(false);
  useEffect(() => setMoved(false), [selected]);
  useEffect(() => setMoved(true), [moving]);

  return (
    <View
      style={[StyleSheet.absoluteFill, visible && styles.visible]}
      pointerEvents="none"
      onLayout={onLayout}
    >
      {visible && (
        <View style={styles.ctaWrapper}>
          <Caption style={styles.ctaText}>
            {t(
              moved
                ? 'screens:addSection.shape.releaseCta'
                : 'screens:addSection.shape.dragCta',
            )}
          </Caption>
        </View>
      )}
      {visible && <View style={[styles.cross, positions?.hor]} />}
      {visible && <View style={[styles.cross, positions?.vert]} />}
      {visible && (
        <Image
          source={selected === 0 ? PUT_IN_PIN : TAKE_OUT_PIN}
          style={[styles.pin, positions?.pin]}
        />
      )}
    </View>
  );
});

PiToOverlay.displayName = 'PiToOverlay';

export default PiToOverlay;
