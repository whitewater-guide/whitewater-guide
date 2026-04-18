import type { License, Media } from '@whitewater-guide/schema';
import { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import { Gallery } from 'react-native-zoom-toolkit';

import Icon from '../Icon';
import PhotoGalleryFooter from './PhotoGalleryFooter';
import PhotoGalleryItem from './PhotoGalleryItem';

interface Props {
  photos: Media[];
  index: number;
  onClose: () => void;
  sectionLicense?: License;
}

interface InnerProps {
  photos: Media[];
  current: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
  sectionLicense?: License;
}

function PhotoGalleryInner({
  photos,
  current,
  onIndexChange,
  onClose,
  sectionLicense,
}: InnerProps) {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <Gallery
        data={photos}
        keyExtractor={(p) => p.id}
        initialIndex={current}
        maxScale={5}
        onIndexChange={onIndexChange}
        onVerticalPull={(translateY, released) => {
          'worklet';
          if (released && translateY > 120) scheduleOnRN(onClose);
        }}
        renderItem={(item) => <PhotoGalleryItem media={item} />}
      />
      <View
        style={[styles.header, { paddingTop: top + 4 }]}
        pointerEvents="box-none"
      >
        <Icon
          icon="close"
          color="white"
          onPress={onClose}
          style={styles.closeIcon}
        />
      </View>
      <View
        style={[styles.footer, { paddingBottom: bottom + 4 }]}
        pointerEvents="box-none"
      >
        <PhotoGalleryFooter
          photo={photos[current]}
          sectionLicense={sectionLicense}
        />
      </View>
    </View>
  );
}

function PhotoGallery({ photos, index, onClose, sectionLicense }: Props) {
  const [current, setCurrent] = useState(Math.max(0, index));

  if (index < 0 || photos.length === 0) {
    return null;
  }

  return (
    <Modal visible animationType="fade" onRequestClose={onClose}>
      <SafeAreaProvider>
        <PhotoGalleryInner
          photos={photos}
          current={current}
          onIndexChange={setCurrent}
          onClose={onClose}
          sectionLicense={sectionLicense}
        />
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'flex-end',
    paddingRight: 4,
  },
  closeIcon: {
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderRadius: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 4,
    paddingTop: 4,
    alignItems: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
});

PhotoGallery.displayName = 'PhotoGallery';

export default PhotoGallery;
