import type { Unit } from '@whitewater-guide/schema';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const styles = StyleSheet.create({
  text: {
    color: 'rgba(52, 52, 52, 0.87)',
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 2,
  },
});

interface Props {
  unit: Unit;
}

/**
 * Animated unit label for ChartFlowToggle.
 * Plays a FadeIn animation whenever the unit changes (after the first render).
 */
function ChartFlowToggleUnit({ unit }: Props) {
  const { t } = useTranslation();
  const [pulse, setPulse] = useState(-1);

  useEffect(() => {
    setPulse((p) => p + 1);
  }, [unit]);

  const label = t(`screens:section.chart.lastRecorded.${unit}`);

  if (pulse > 0) {
    return (
      <Animated.Text key={`txt${pulse}`} entering={FadeIn} style={styles.text}>
        {label}
      </Animated.Text>
    );
  }
  return <Text style={styles.text}>{label}</Text>;
}

export default ChartFlowToggleUnit;
