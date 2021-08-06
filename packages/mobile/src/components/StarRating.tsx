import React from 'react';
import SwipeableRating, {
  SwipableRatingProps,
} from 'react-native-swipeable-rating';

import theme from '../theme';

interface Props extends Omit<SwipableRatingProps, 'rating' | 'onPress'> {
  value: number;
  onChange?: (value: number) => void;
}

const StarRating: React.FC<Props> = React.memo(
  ({ value, onChange, ...props }) => (
    <SwipeableRating
      {...props}
      allowHalves
      minRating={0}
      size={onChange ? 30 : 14}
      color={theme.colors.primary}
      emptyColor={theme.colors.componentBorder}
      rating={value}
      onPress={onChange}
    />
  ),
);

StarRating.displayName = 'StarRating';

export default StarRating;
