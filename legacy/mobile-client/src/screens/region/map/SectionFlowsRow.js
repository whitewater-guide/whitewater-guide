import React from 'react';
import { StyleSheet, View } from 'react-native';
import moment from 'moment';
import { getSectionColor, ColorStrings, prettyNumber } from '../../../commons/features/sections';
import { Body, Left, ListItem, Text, Right } from '../../../components';
import theme from '../../../theme';

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
        <Left><Text>Flows</Text></Left>
        <Body>
          <Text note right>
            {flowsText || 'unknown'}
          </Text>
        </Body>
      </ListItem>
    );
  }
  const data = (flows && flows.lastValue) ?
    { ...flows, label: 'Flow', color: getSectionColor(flows), unit: gauge.flowUnit } :
    { ...levels, label: 'Level', color: getSectionColor(levels), unit: gauge.levelUnit };

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
              { ` ${data.unit}` }
            </Text>
          </Text>
          <Text note style={styles.timeLine}>{moment(data.lastTimestamp).fromNow()}</Text>
        </View>
        <View style={styles.binding}>
          { data.minimum && <Text style={styles.minimum}>{`${data.minimum} min`}</Text>}
          { data.optimum && <Text style={styles.optimum}>{`${data.optimum} opt`}</Text>}
          { data.maximum && <Text style={styles.maximum}>{`${data.maximum} max`}</Text>}
        </View>
      </Right>
    </ListItem>
  );
};

export default SectionFlowsRow;
