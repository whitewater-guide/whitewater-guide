import type { MediaWithThumbFragment } from '@whitewater-guide/schema';
import { Image, Pressable, StyleSheet } from 'react-native';

import theme from '../../../theme';
import { PHOTO_PADDING, PHOTO_SIZE } from './mediaConstants';

interface Props {
  photo: MediaWithThumbFragment;
  index: number;
  onPress: (index: number) => void;
}

function PhotoGridItem({ photo, index, onPress }: Props) {
  return (
    <Pressable onPress={() => onPress(index)}>
      <Image
        source={{ uri: photo.thumb ?? photo.image ?? undefined }}
        style={styles.image}
        resizeMode="cover"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    margin: PHOTO_PADDING / 2,
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    backgroundColor: theme.colors.border,
  },
});

export default PhotoGridItem;
