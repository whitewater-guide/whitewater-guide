import PropTypes from 'prop-types';
import React from 'react';
import { Button, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
});

const ChartPeriodToggle = ({ onChange }) => (
  <View style={styles.container}>
    <Button small label="One day" onPress={() => onChange(1)}>
      <Text>Day</Text>
    </Button>
    <Button small label="One week" onPress={() => onChange(7)}>
      <Text>Week</Text>
    </Button>
    <Button small label="One month" onPress={() => onChange(31)}>
      <Text>Month</Text>
    </Button>
  </View>
);

ChartPeriodToggle.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default ChartPeriodToggle;
