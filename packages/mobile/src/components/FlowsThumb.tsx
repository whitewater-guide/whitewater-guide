import moment from 'moment';
import React from 'react';
import { WithI18n } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { WithTrans } from '../i18n';
import { getSectionColor, prettyNumber } from '../ww-clients/features/sections';
import { Section } from '../ww-commons';

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

interface Props extends WithTrans {
  section: Section;
}

export const FlowsThumb: React.StatelessComponent<Props> = ({ section, t }) => {
  const { levels, flows, gauge } = section;
  if (!gauge) {
    return null;
  }
  const { lastMeasurement, flowUnit, levelUnit } = gauge;
  if (!lastMeasurement || (!lastMeasurement.flow && !lastMeasurement.level) || (!flows && !levels)) {
    return null;
  }
  const color = getSectionColor(section);
  const data = (flows && lastMeasurement.flow) ?
    { label: t('commons:flow'), unit: flowUnit, value: lastMeasurement.flow } :
    { label: t('commons:level'), unit: levelUnit, value: lastMeasurement.level };
  return (
    <View style={styles.container}>
      <Text style={styles.unitLine}>{data.label}</Text>
      <Text style={[styles.mainLine, { color }]}>
        {prettyNumber(data.value)}
        <Text style={[styles.unitLine, { color }]}>
          {` ${t('commons:' + data.unit)}`}
        </Text>
      </Text>
      <Text style={styles.timeLine}>{moment(lastMeasurement.timestamp).fromNow()}</Text>
    </View>
  );
};
