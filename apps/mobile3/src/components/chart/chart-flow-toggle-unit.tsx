import { Unit } from '@whitewater-guide/schema';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';

export interface ChartFlowToggleUnitProps {
  unit: Unit;
}

export function ChartFlowToggleUnit({ unit }: ChartFlowToggleUnitProps) {
  const { t } = useTranslation();
  const [pulse, setPulse] = useState(-1);

  useEffect(() => {
    setPulse((p) => p + 1);
  }, [unit]);

  const label = t(`section:chart.lastRecorded.${unit}`);

  if (pulse > 0) {
    return (
      <Animated.Text key={`txt${pulse}`} entering={FadeIn} style={styles.text}>
        {label}
      </Animated.Text>
    );
  }
  return <ThemedText style={styles.text}>{label}</ThemedText>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 2,
  },
});
