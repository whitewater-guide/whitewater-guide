import {
  formatDistanceToNow,
  getSectionColor,
  prettyNumber,
  useFormulas,
} from '@whitewater-guide/clients';
import { Section } from '@whitewater-guide/commons';
import parseISO from 'date-fns/parseISO';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 52,
    paddingHorizontal: 4,
    marginLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#c9c9c9',
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
  mainLine: {
    fontSize: 18,
    fontWeight: '400',
  },
  unitLine: {
    fontSize: 12,
  },
  timeLine: {
    fontSize: 12,
  },
});

interface Props {
  section: Section;
}

const FlowsThumb: React.FC<Props> = ({ section }) => {
  const [t] = useTranslation();
  const formulas = useFormulas(section);
  const { gauge } = section;
  if (!gauge) {
    return null;
  }
  const { latestMeasurement, flowUnit, levelUnit } = gauge;
  if (
    !latestMeasurement ||
    (!latestMeasurement.flow && !latestMeasurement.level)
  ) {
    return null;
  }
  const color = getSectionColor(section);
  const data = latestMeasurement.flow
    ? {
        label: t('commons:flow'),
        unit: flowUnit,
        value: formulas.flows(latestMeasurement.flow),
      }
    : {
        label: t('commons:level'),
        unit: levelUnit,
        value: formulas.levels(latestMeasurement.level),
      };
  const fromNow = formatDistanceToNow(parseISO(latestMeasurement.timestamp), {
    addSuffix: true,
  });
  return (
    <View style={styles.container}>
      <Text style={styles.unitLine}>{data.label}</Text>
      <Text style={[styles.mainLine, { color }]}>
        {prettyNumber(data.value)}
        <Text style={[styles.unitLine, { color }]}>
          {` ${t('commons:' + data.unit)}`}
        </Text>
      </Text>
      <Text style={styles.timeLine}>{fromNow}</Text>
    </View>
  );
};

export default FlowsThumb;
