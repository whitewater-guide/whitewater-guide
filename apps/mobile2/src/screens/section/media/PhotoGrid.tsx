import type { MediaWithThumbFragment } from '@whitewater-guide/schema';
import { MediaKind } from '@whitewater-guide/schema';
import { StyleSheet, View } from 'react-native';

import { PHOTO_PADDING } from './mediaConstants';
import NoMedia from './NoMedia';
import PhotoGridItem from './PhotoGridItem';

interface Props {
  photos?: MediaWithThumbFragment[];
  onPress: (index: number) => void;
}

function PhotoGrid({ photos, onPress }: Props) {
  if (!photos || photos.length === 0) {
    return <NoMedia kind={MediaKind.Photo} />;
  }
  return (
    <View style={styles.grid}>
      {photos.map((photo, index) => (
        <PhotoGridItem
          key={photo.id}
          photo={photo}
          index={index}
          onPress={onPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: PHOTO_PADDING / 2,
  },
});

export default PhotoGrid;
