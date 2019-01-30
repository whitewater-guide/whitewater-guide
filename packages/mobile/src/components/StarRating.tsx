import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
  unknownContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unknownText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
});

interface Props extends StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
}

export const StarRating: React.StatelessComponent<Props> = ({
  value,
  onChange,
  ...props
}) => {
  const isUnknown = value === 0 && !onChange;
  const fullStarColor = onChange
    ? theme.colors.primary
    : theme.colors.componentBorder;
  const emptyStarColor = isUnknown
    ? 'rgba(158, 158, 158, 0.4)'
    : theme.colors.componentBorder;
  return (
    <View style={onChange ? styles.containerInteractive : styles.container}>
      <View>
        <RNStarRating
          {...props}
          iconSet="MaterialCommunityIcons"
          fullStar="star"
          emptyStar="star-outline"
          halfStar="star-half"
          rating={value}
          starSize={onChange ? 30 : 14}
          halfStarColor={fullStarColor}
          fullStarColor={fullStarColor}
          emptyStarColor={emptyStarColor}
          selectedStar={onChange}
        />
        {isUnknown && (
          <View style={styles.unknownContainer} pointerEvents="none">
            <Text style={styles.unknownText}>?</Text>
          </View>
        )}
      </View>
      {!onChange && <View style={styles.compressor} />}
    </View>
  );
};
