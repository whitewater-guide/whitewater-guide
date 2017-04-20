import React from 'react';
import { propType } from 'graphql-anywhere';
import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment';
import { SectionFragments, getSectionColor } from '../../../commons/features/sections';

const styles = StyleSheet.create({
  container: {
    height: 52,
    paddingHorizontal: 4,
    marginLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#c9c9c9',
    borderLeftWidth: 1,
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

const FlowsThumb = ({ flows, levels }) => {
  if ((!flows || !flows.lastValue) && (!levels || !levels.lastValue)) {
    return null;
  }
  const data = (flows && flows.lastValue) ?
    { unit: 'Flow', value: flows.lastValue, color: getSectionColor(flows) } :
    { unit: 'Level', value: levels.lastValue, color: getSectionColor(levels) };
  return (
    <View style={styles.container}>
      <Text style={styles.unitLine}>{data.unit}</Text>
      <Text style={[styles.mainLine, { color: data.color }]}>{data.value.toFixed(2)}</Text>
      <Text style={styles.timeLine}>{moment(data.lastTimestamp).fromNow()}</Text>
    </View>
  );
};

FlowsThumb.propTypes = {
  flows: propType(SectionFragments.GaugeBinding.All),
  levels: propType(SectionFragments.GaugeBinding.All),
};

FlowsThumb.defaultProps = {
  flows: null,
  levels: null,
};

export default FlowsThumb;
