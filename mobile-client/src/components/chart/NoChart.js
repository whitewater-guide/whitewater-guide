import React, { PropTypes } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, Icon } from 'native-base';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width,
    height: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const NoChart = ({ noData }) => {
  const message = noData ? 'There is no data for this period' : 'There is no gauge for this section';
  return (
    <View style={styles.container}>
      <Icon name="warning" />
      <Text>{message}</Text>
    </View>
  );
};

NoChart.propTypes = {
  noData: PropTypes.bool,
};

NoChart.defaultProps = {
  noData: false,
};

export default NoChart;
