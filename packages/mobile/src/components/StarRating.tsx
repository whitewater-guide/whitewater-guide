import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import RNStarRating, { StarRatingProps } from 'react-native-star-rating';
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

interface Props extends StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
}

export const StarRating: React.StatelessComponent<Props> = ({ value, onChange, ...props }) => (
  <View style={onChange ? styles.containerInteractive : styles.container}>
    <RNStarRating
      {...props}
      iconSet="Ionicons"
      fullStar={Platform.OS === 'ios' ? 'ios-star' : 'md-star'}
      emptyStar={Platform.OS === 'ios' ? 'ios-star-outline' : 'md-star-outline'}
      halfStar={Platform.OS === 'ios' ? 'ios-star-half' : 'md-star-half'}
      rating={value}
      starSize={onChange ? 30 : 14}
      halfStarColor={onChange ? theme.colors.primary : theme.colors.componentBorder}
      fullStarColor={onChange ? theme.colors.primary : theme.colors.componentBorder}
      emptyStarColor={theme.colors.componentBorder}
      selectedStar={onChange}
    />
    {!onChange && <View style={styles.compressor} />}
  </View>
);
