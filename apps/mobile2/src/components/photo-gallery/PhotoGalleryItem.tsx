import type { Media } from '@whitewater-guide/schema';
import { Image, StyleSheet, useWindowDimensions } from 'react-native';

interface Props {
  media: Media;
}

function PhotoGalleryItem({ media }: Props) {
  const { width, height } = useWindowDimensions();
  return (
    <Image
      source={{ uri: media.image ?? undefined }}
      style={[styles.image, { width, height }]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: 'black',
  },
});

export default PhotoGalleryItem;
