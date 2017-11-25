import React from 'react';
import PropTypes from 'prop-types';
import { propType } from 'graphql-anywhere';
import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment';
import { SectionFragments, getSectionColor, prettyNumber } from '../commons/features/sections';
import I18n from '../i18n';

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

const FlowsThumb = ({ flows, levels, flowUnit, levelUnit }) => {
  if ((!flows || !flows.lastValue) && (!levels || !levels.lastValue)) {
    return null;
  }
  const data = (flows && flows.lastValue) ?
    { ...flows, label: I18n.t('commons.flow'), color: getSectionColor(flows), unit: flowUnit } :
    { ...levels, label: I18n.t('commons.level'), color: getSectionColor(levels), unit: levelUnit };
  return (
    <View style={styles.container}>
      <Text style={styles.unitLine}>{data.label}</Text>
      <Text style={[styles.mainLine, { color: data.color }]}>
        {prettyNumber(data.lastValue)}
        <Text style={[styles.unitLine, { color: data.color }]}>
          {` ${I18n.t('commons.' + data.unit)}`}
        </Text>
      </Text>
      <Text style={styles.timeLine}>{moment(data.lastTimestamp).fromNow()}</Text>
    </View>
  );
};

FlowsThumb.propTypes = {
  flows: propType(SectionFragments.GaugeBinding.All),
  levels: propType(SectionFragments.GaugeBinding.All),
  flowUnit: PropTypes.string,
  levelUnit: PropTypes.string,
};

FlowsThumb.defaultProps = {
  flows: null,
  levels: null,
  levelUnit: '',
  flowUnit: '',
};

export default FlowsThumb;
