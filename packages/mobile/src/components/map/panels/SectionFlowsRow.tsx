import {
  ColorStrings,
  getSectionColor,
  prettyNumber,
  useFormulas,
} from '@whitewater-guide/clients';
import { Section } from '@whitewater-guide/commons';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Caption, Subheading } from 'react-native-paper';
import theme from '../../../theme';
import { Row } from '../../Row';
import SimpleTextFlowRow from './SimpleTextFlowRow';

export const FLOWS_ROW_HEIGHT = 64;

const styles = StyleSheet.create({
  container: {
    height: FLOWS_ROW_HEIGHT,
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

interface Props {
  section: Section | null;
}

const propsAreEqual = (a: Props, b: Props): boolean =>
  (a.section && a.section.id) === (b.section && b.section.id);

const SectionFlowsRow: React.FC<Props> = React.memo(({ section }) => {
  const [t] = useTranslation();
  const formulas = useFormulas(section || undefined);
  if (!section) {
    return <SimpleTextFlowRow style={styles.container} />;
  }
  const { flows, levels, gauge, flowsText } = section;
  if (!gauge || !gauge.lastMeasurement || (!flows && !levels)) {
    return <SimpleTextFlowRow flowsText={flowsText} style={styles.container} />;
  }
  const color = getSectionColor(section);
  const preferFlow = flows && gauge.lastMeasurement.flow;
  const binding = (preferFlow ? flows : levels)!;
  const label = preferFlow ? t('commons:flow') : t('commons:level');
  const unitName = preferFlow ? gauge.flowUnit : gauge.levelUnit;
  const value = preferFlow
    ? formulas.flows(gauge.lastMeasurement.flow)
    : formulas.levels(gauge.lastMeasurement.level);
  return (
    <Row style={styles.container}>
      <Subheading>{label}</Subheading>
      <View style={styles.flowContainer}>
        <Text style={[styles.mainLine, { color }]}>
          {prettyNumber(value)}
          <Text style={[styles.unitLine, { color }]}>
            {` ${t('commons:' + unitName)}`}
          </Text>
        </Text>
        <Caption style={styles.timeLine}>
          {moment(gauge.lastMeasurement.timestamp).fromNow()}
        </Caption>
      </View>
      <View style={styles.binding}>
        {binding.minimum && (
          <Caption style={styles.minimum}>{`${binding.minimum} ${t(
            'commons:min',
          )}`}</Caption>
        )}
        {binding.optimum && (
          <Caption style={styles.optimum}>{`${binding.optimum} ${t(
            'commons:opt',
          )}`}</Caption>
        )}
        {binding.maximum && (
          <Caption style={styles.maximum}>{`${binding.maximum} ${t(
            'commons:max',
          )}`}</Caption>
        )}
      </View>
    </Row>
  );
}, propsAreEqual);

SectionFlowsRow.displayName = 'SectionFlowsRow';

export default SectionFlowsRow;
