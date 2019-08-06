import React, { useCallback, useMemo } from 'react';
import { Modal, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import LoadableImage from './LoadableImage';
import PhotoGalleryFooter from './PhotoGalleryFooter';
import PhotoGalleryHeader from './PhotoGalleryHeader';
import PhotoGalleryIndicator from './PhotoGalleryIndicator';
import { PhotoGalleryItem } from './types';

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 4,
    paddingBottom: 4 + getBottomSpace(),
    alignItems: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
});

interface Props {
  photos?: PhotoGalleryItem[];
  index: number;
  onClose: () => void;
  ImageComponent?: React.ComponentType;
}

export const PhotoGallery: React.FC<Props> = React.memo((props) => {
  const { photos = [], index, onClose, ImageComponent = LoadableImage } = props;

  const imageUrls = useMemo(
    () =>
      photos
        .filter(({ image }) => !!image)
        .map(({ image, resolution }) => ({
          url: image!,
          width: resolution ? resolution[0] : 0,
          height: resolution ? resolution[1] : 0,
        })),
    [photos],
  );

  const renderHeader = useCallback(
    () => <PhotoGalleryHeader onClose={onClose} />,
    [onClose],
  );

  const renderFooter = useCallback(
    (i?: number) => <PhotoGalleryFooter index={i} photos={photos} />,
    [photos],
  );

  const renderIndicator = useCallback(
    (ind: number = 0, total: number = 0) => (
      <PhotoGalleryIndicator index={ind} total={total} />
    ),
    [],
  );

  const renderImage = useCallback((opts: any) => <ImageComponent {...opts} />, [
    ImageComponent,
  ]);

  if (photos.length === 0) {
    return null;
  }
  return (
    <Modal visible={index >= 0} onRequestClose={onClose}>
      <ImageViewer
        imageUrls={imageUrls}
        index={Math.max(0, index)}
        saveToLocalByLongPress={false}
        renderHeader={renderHeader}
        renderIndicator={renderIndicator}
        footerContainerStyle={styles.footerContainer}
        renderFooter={renderFooter}
        renderImage={renderImage}
      />
    </Modal>
  );
});

PhotoGallery.displayName = 'PhotoGallery';
