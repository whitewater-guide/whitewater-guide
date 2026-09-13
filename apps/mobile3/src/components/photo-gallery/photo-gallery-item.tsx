import type { License } from '@whitewater-guide/schema';
import { Image } from 'expo-image';
import { StyleSheet, useWindowDimensions } from 'react-native';

export interface GalleryPhoto {
  id: string;
  image?: string | null;
  description?: string | null;
  copyright?: string | null;
  license?: License | null;
}

export interface PhotoGalleryItemProps {
  photo: GalleryPhoto;
}

function PhotoGalleryItem({ photo }: PhotoGalleryItemProps) {
  const { width, height } = useWindowDimensions();
  return (
    <Image
      source={photo.image ?? undefined}
      style={[styles.image, { width, height }]}
      contentFit="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: 'black',
  },
});

export default PhotoGalleryItem;
