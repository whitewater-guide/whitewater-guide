import PropTypes from 'prop-types';
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import moment from 'moment';
import { Button, Body, ListItem } from '../index';
import theme from '../../theme';
import I18n from '../../i18n';

const styles = StyleSheet.create({
  container: {
    height: 48,
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 4,
  },
});

const ChartPeriodToggle = ({ onChange, loading, startDate, endDate }) => {
  const days = moment(endDate).diff(startDate, 'days');
  const index = days > 10 ? 2 : (days > 2 ? 1 : 0);
  return (
    <ListItem style={styles.container}>
      {
        loading ?
          <Body>
            <ActivityIndicator color={theme.colors.primary} />
          </Body>
          :
          <Body flexDirection="row">
            <Button small primary={index === 0} outlined={index !== 0} style={styles.button} label={I18n.t('section.chart.day')} onPress={() => onChange(1)} />
            <Button small primary={index === 1} outlined={index !== 1} style={styles.button} label={I18n.t('section.chart.week')} onPress={() => onChange(7)} />
            <Button small primary={index === 2} outlined={index !== 2} style={styles.button} label={I18n.t('section.chart.month')} onPress={() => onChange(31)} />
          </Body>
      }
    </ListItem>
  );
};

ChartPeriodToggle.propTypes = {
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
};

export default ChartPeriodToggle;
