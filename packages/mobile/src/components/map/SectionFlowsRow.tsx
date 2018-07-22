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
  section: Section | null;
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
  const preferFlow = flows && gauge.lastMeasurement.flow;
  const binding = (preferFlow ? flows : levels)!;
  const label = preferFlow ? t('commons:flow') : t('commons:level');
  const unitName = preferFlow ? gauge.flowUnit : gauge.levelUnit;
  const value = preferFlow ? gauge.lastMeasurement.flow : gauge.lastMeasurement.level;
  return (
    <Row>
      <Subheading>{label}</Subheading>
      <View style={styles.flowContainer}>
        <Text style={[styles.mainLine, { color }]}>
          {prettyNumber(value)}
          <Text style={[styles.unitLine, { color }]}>
            {` ${t('commons:' + unitName)}`}
          </Text>
        </Text>
        <Caption style={styles.timeLine}>{moment(gauge.lastMeasurement.timestamp).fromNow()}</Caption>
      </View>
      <View style={styles.binding}>
        {binding.minimum && <Caption style={styles.minimum}>{`${binding.minimum} ${t('commons:min')}`}</Caption>}
        {binding.optimum && <Caption style={styles.optimum}>{`${binding.optimum} ${t('commons:opt')}`}</Caption>}
        {binding.maximum && <Caption style={styles.maximum}>{`${binding.maximum} ${t('commons:max')}`}</Caption>}
      </View>
    </Row>
  );
};

export default SectionFlowsRow;
