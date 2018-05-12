import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Caption, Subheading } from 'react-native-paper';
import { WithT } from '../../i18n';
import theme from '../../theme';
import { ColorStrings, getSectionColor, prettyNumber } from '../../ww-clients/features/sections';
import { Section } from '../../ww-commons';
import { Row } from '../Row';
import SimpleTextFlowRow from './SimpleTextFlowRow';

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    alignItems: 'center',
    minHeight: 48,
  },
  flowContainer: {
    flex: 1,
    alignItems: 'flex-end',
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
});

interface Props extends WithT {
  section: Section;
}

const SectionFlowsRow: React.StatelessComponent<Props> = ({ section, t }) => {
  if (!section) {
    return <SimpleTextFlowRow t={t} />;
  }
  const { flows, levels, gauge, flowsText } = section;
  if (!gauge || !gauge.lastMeasurement || (!flows && !levels)) {
    return <SimpleTextFlowRow flowsText={flowsText} t={t} />;
  }
  const color = getSectionColor(section);
  const data = (flows && gauge.lastMeasurement.flow) ?
    { ...flows, label: t('commons:flow'), unit: gauge.flowUnit, value: gauge.lastMeasurement.flow} :
    { ...levels, label: t('commons:level'), unit: gauge.levelUnit, value: gauge.lastMeasurement.level };

  return (
    <Row>
      <Subheading>{data.label}</Subheading>
      <View style={styles.flowContainer}>
        <Text style={[styles.mainLine, { color }]}>
          {prettyNumber(data.value)}
          <Text style={[styles.unitLine, { color }]}>
            {` ${t('commons:' + data.unit)}`}
          </Text>
        </Text>
        <Caption style={styles.timeLine}>{moment(gauge.lastMeasurement.timestamp).fromNow()}</Caption>
      </View>
      <View style={styles.binding}>
        {data.minimum && <Caption style={styles.minimum}>{`${data.minimum} ${t('commons:min')}`}</Caption>}
        {data.optimum && <Caption style={styles.optimum}>{`${data.optimum} ${t('commons:opt')}`}</Caption>}
        {data.maximum && <Caption style={styles.maximum}>{`${data.maximum} ${t('commons:max')}`}</Caption>}
      </View>
    </Row>
  );
};

export default SectionFlowsRow;
