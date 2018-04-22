import moment from 'moment';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WithT } from '../../i18n';
import theme from '../../theme';
import { ColorStrings, getSectionColor, prettyNumber } from '../../ww-clients/features/sections';
import { Section } from '../../ww-commons/features/sections';
import { Text } from '../Text';

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    alignItems: 'center',
    minHeight: 48,
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
  minimum: {
    fontSize: 12,
    color: ColorStrings.minimum,
  },
  optimum: {
    fontSize: 12,
    color: ColorStrings.optimum,
  },
  maximum: {
    fontSize: 12,
    color: ColorStrings.maximum,
  },
  binding: {
    alignItems: 'flex-end',
    marginLeft: 8,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: theme.colors.border,
    paddingLeft: 8,
  },
  listItem: {
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
});

interface Props extends WithT {
  section: Section;
}

const SectionFlowsRow: React.StatelessComponent<Props> = ({ section, t }) => {
  if (!section) {
    return null;
  }
  const { flows, levels, gauge, flowsText } = section;
  if (!gauge || !gauge.lastMeasurement || (!flows && !levels)) {
    return (
      <View style={styles.listItem}>
        <Text>{t('region:map.selectedSection.flows')}</Text>
        <Text>
          {flowsText || t('commons:unknown')}
        </Text>
      </View>
    );
  }
  const color = getSectionColor(section);
  const data = (flows && gauge.lastMeasurement.flow) ?
    { ...flows, label: t('commons:flow'), unit: gauge.flowUnit, value: gauge.lastMeasurement.flow} :
    { ...levels, label: t('commons:level'), unit: gauge.levelUnit, value: gauge.lastMeasurement.level };

  return (
    <View style={styles.listItem}>
      <Text>{data.label}</Text>
      <View style={{ flexDirection: 'row' }}>
        <View>
          <Text style={[styles.mainLine, { color }]}>
            {prettyNumber(data.value)}
            <Text style={[styles.unitLine, { color }]}>
              {` ${t('commons.' + data.unit)}`}
            </Text>
          </Text>
          <Text note style={styles.timeLine}>{moment(gauge.lastMeasurement.timestamp).fromNow()}</Text>
        </View>
        <View style={styles.binding}>
          {data.minimum && <Text style={styles.minimum}>{`${data.minimum} ${t('commons:min')}`}</Text>}
          {data.optimum && <Text style={styles.optimum}>{`${data.optimum} ${t('commons:opt')}`}</Text>}
          {data.maximum && <Text style={styles.maximum}>{`${data.maximum} ${t('commons:max')}`}</Text>}
        </View>
      </View>
    </View>
  );
};

export default SectionFlowsRow;
