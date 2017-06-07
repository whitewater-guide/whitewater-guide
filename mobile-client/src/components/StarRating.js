import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, View } from 'react-native';
import RNStarRating from 'react-native-star-rating';
import theme from '../theme';

const styles = StyleSheet.create({
  containerInteractive: {
    paddingVertical: 4,
    width: 200,
  },
  container: {
    flexDirection: 'row',
  },
  compressor: {
    flex: 1,
  },
});

const StarRating = ({ value, onChange, ...props }) => (
  <View style={onChange ? styles.containerInteractive : styles.container}>
    <RNStarRating
      {...props}
      iconSet="Ionicons"
      fullStar={Platform.OS === 'ios' ? 'ios-star' : 'md-star'}
      emptyStar={Platform.OS === 'ios' ? 'ios-star-outline' : 'md-star-outline'}
      halfStar={Platform.OS === 'ios' ? 'ios-star-half' : 'md-star-half'}
      rating={value}
      starSize={onChange ? 30 : 14}
      starColor={onChange ? theme.colors.primary : theme.colors.borderColor}
      emptyStarColor={onChange ? theme.colors.primary : theme.colors.borderColor}
      selectedStar={onChange}
    />
    { !onChange && <View style={styles.compressor} /> }
  </View>
);


StarRating.propTypes = {
  ...RNStarRating.propTypes,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func,
};

StarRating.defaultProps = {
  onChange: null,
};

export default StarRating;
