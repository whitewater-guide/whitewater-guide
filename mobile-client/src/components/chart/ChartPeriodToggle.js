import PropTypes from 'prop-types';
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Button, Body, ListItem } from '../index';
import theme from '../../theme';

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

const ChartPeriodToggle = ({ onChange, loading }) => (
  <ListItem style={styles.container}>
    {
      loading ?
        <Body>
          <ActivityIndicator color={theme.colors.primary} />
        </Body>
          :
        <Body flexDirection="row">
          <Button small primary style={styles.button} label="Daily" onPress={() => onChange(1)} />
          <Button small primary style={styles.button} label="Weekly" onPress={() => onChange(7)} />
          <Button small primary style={styles.button} label="Monthly" onPress={() => onChange(31)} />
        </Body>
    }
  </ListItem>
);

ChartPeriodToggle.propTypes = {
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ChartPeriodToggle;
