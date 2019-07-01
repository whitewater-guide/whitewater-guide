import { Unit } from '@whitewater-guide/commons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';

const styles = StyleSheet.create({
  text: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 2,
  },
});

interface Props {
  unit: Unit;
}

const ChartFlowToggleUnit: React.FC<Props> = React.memo(({ unit }) => {
  const { t } = useTranslation();
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    setPulse(pulse + 1);
  }, [unit]);
  if (pulse !== 0) {
    return (
      <Animatable.Text
        key={`txt${pulse}`}
        animation="fadeIn"
        delay={200}
        style={styles.text}
      >
        {t(`section:chart.lastRecorded.${unit}`)}
      </Animatable.Text>
    );
  } else {
    return (
      <Text style={styles.text}>{t(`section:chart.lastRecorded.${unit}`)}</Text>
    );
  }
});

ChartFlowToggleUnit.displayName = 'ChartFlowToggleUnit';

export default ChartFlowToggleUnit;
