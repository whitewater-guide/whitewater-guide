import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutAnimation,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Paragraph } from 'react-native-paper';
import rnTextSize from 'react-native-text-size';
import theme from '../theme';
import validatePassword from '../utils/validatePassword';

const COLORS = [
  theme.colors.error,
  theme.colors.error,
  '#FF9800', // orange 500,
  '#FFEB3B', // yellow 500,
  '#4CAF50', // green 500,
];

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bar: {
    marginTop: 1,
    flex: 1,
    height: theme.margin.half,
    backgroundColor: theme.colors.componentBorder,
    marginRight: theme.margin.half,
  },
  progress: {
    height: theme.margin.half,
  },
});

interface Props {
  value?: string;
  style?: StyleProp<ViewStyle>;
}

const PasswordStrengthIndicator: React.FC<Props> = React.memo(
  ({ value, style }) => {
    useEffect(() => {
      LayoutAnimation.easeInEaseOut();
    }, [value]);
    const [textWidth, setTextWidth] = useState(0);
    const { t } = useTranslation();
    useEffect(() => {
      const measure = async () => {
        const text = [0, 1, 2, 3, 4]
          .map((v) => t(`components:PasswordStrengthIndicator.strength${v}`))
          .join('\n');
        const size = await rnTextSize.measure({
          text,
          fontSize: 14, // see paper's Paragraph style
        });
        setTextWidth(size.width);
      };
      measure().catch(() => {});
    }, []);
    const [width, setWidth] = useState(0);
    const onLayout = useCallback(
      (e: LayoutChangeEvent) => {
        setWidth(e.nativeEvent.layout.width);
      },
      [setWidth],
    );
    const score = validatePassword(value);
    return (
      <View style={[styles.root, { opacity: textWidth === 0 ? 0 : 1 }, style]}>
        <View
          style={[styles.bar, { opacity: textWidth === 0 ? 0 : 1 }]}
          onLayout={onLayout}
        >
          <View
            style={[
              styles.progress,
              {
                width: (width * (score + 1)) / 5,
                backgroundColor: COLORS[score],
              },
            ]}
          />
        </View>
        <Paragraph
          style={{ width: textWidth, textAlign: 'right', color: COLORS[score] }}
        >
          {t(`components:PasswordStrengthIndicator.strength${score}`)}
        </Paragraph>
      </View>
    );
  },
);

PasswordStrengthIndicator.displayName = 'PasswordStrengthIndicator';

export default PasswordStrengthIndicator;
