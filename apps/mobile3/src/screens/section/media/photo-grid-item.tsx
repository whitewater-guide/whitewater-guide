import type { MediaWithThumbFragment } from '@whitewater-guide/schema';
import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { PHOTO_PADDING, PHOTO_SIZE } from './media-constants';

export interface PhotoGridItemProps {
  photo: MediaWithThumbFragment;
  index: number;
  onPress: (index: number) => void;
}

function PhotoGridItem({ photo, index, onPress }: PhotoGridItemProps) {
  const theme = useTheme();
  return (
    <Pressable onPress={() => onPress(index)}>
      <Image
        source={photo.thumb ?? photo.image ?? undefined}
        style={[styles.image, { backgroundColor: theme.backgroundSelected }]}
        contentFit="cover"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    margin: PHOTO_PADDING / 2,
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
  },
});

export default PhotoGridItem;
