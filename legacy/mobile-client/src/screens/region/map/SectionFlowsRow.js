import React from 'react';
import { StyleSheet, View } from 'react-native';
import moment from 'moment';
import { getSectionColor, ColorStrings, prettyNumber } from '../../../commons/features/sections';
import { Body, Left, ListItem, Text, Right } from '../../../components';
import theme from '../../../theme';
import I18n from '../../../i18n';

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
});

const SectionFlowsRow = ({ section = { flowsText: 'unknown' } }) => {
  const { flows, levels, gauge, flowsText } = section;
  if ((!flows || !flows.lastValue) && (!levels || !levels.lastValue)) {
    return (
      <ListItem>
        <Left><Text>{I18n.t('region.map.selectedSection.flows')}</Text></Left>
        <Body>
          <Text note right>
            {flowsText || I18n.t('commons.unknown')}
          </Text>
        </Body>
      </ListItem>
    );
  }
  const data = (flows && flows.lastValue) ?
    { ...flows, label: I18n.t('commons.flow'), color: getSectionColor(flows), unit: gauge.flowUnit } :
    { ...levels, label: I18n.t('commons.level'), color: getSectionColor(levels), unit: gauge.levelUnit };

  return (
    <ListItem>
      <Left>
        <Text>{data.label}</Text>
      </Left>
      <Right flexDirection="row">
        <View>
          <Text style={[styles.mainLine, { color: data.color }]}>
            {prettyNumber(data.lastValue)}
            <Text style={[styles.unitLine, { color: data.color }]}>
              { ` ${I18n.t('commons.'+data.unit)}` }
            </Text>
          </Text>
          <Text note style={styles.timeLine}>{moment(data.lastTimestamp).fromNow()}</Text>
        </View>
        <View style={styles.binding}>
          { data.minimum && <Text style={styles.minimum}>{`${data.minimum} ${I18n.t('commons.min')}`}</Text>}
          { data.optimum && <Text style={styles.optimum}>{`${data.optimum} ${I18n.t('commons.opt')}`}</Text>}
          { data.maximum && <Text style={styles.maximum}>{`${data.maximum} ${I18n.t('commons.max')}`}</Text>}
        </View>
      </Right>
    </ListItem>
  );
};

export default SectionFlowsRow;
