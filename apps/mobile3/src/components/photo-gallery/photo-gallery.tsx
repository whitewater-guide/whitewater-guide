import type { License } from '@whitewater-guide/schema';
import { useCallback, useEffect, useState } from 'react';
import { Modal, StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { Icon } from '@/components/icon';

import PhotoGalleryFooter from './photo-gallery-footer';
import PhotoGalleryItem, { type GalleryPhoto } from './photo-gallery-item';

const MAX_SCALE = 5;
const CLOSE_THRESHOLD = 120;
const PAGE_THRESHOLD = 0.25;

export interface PhotoGalleryProps {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  sectionLicense?: License;
}

interface PhotoGalleryInnerProps {
  photos: GalleryPhoto[];
  current: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  sectionLicense?: License;
}

function PhotoGalleryInner({
  photos,
  current,
  onIndexChange,
  onClose,
  sectionLicense,
}: PhotoGalleryInnerProps) {
  const { width, height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const photoCount = photos.length;

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const pagerIndex = useSharedValue(current);
  const pagerOffset = useSharedValue(-current * width);

  useEffect(() => {
    pagerIndex.value = current;
    pagerOffset.value = -current * width;
    scale.value = 1;
    savedScale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  }, [
    current,
    width,
    pagerIndex,
    pagerOffset,
    scale,
    savedScale,
    translateX,
    translateY,
    savedTranslateX,
    savedTranslateY,
  ]);

  const resetZoom = useCallback(() => {
    scale.value = withTiming(1);
    savedScale.value = 1;
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  }, [
    scale,
    savedScale,
    translateX,
    translateY,
    savedTranslateX,
    savedTranslateY,
  ]);

  const pinch = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = Math.min(
        MAX_SCALE,
        Math.max(1, savedScale.value * event.scale),
      );
    })
    .onEnd(() => {
      if (scale.value < 1.05) {
        scale.value = withTiming(1);
        savedScale.value = 1;
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        savedScale.value = scale.value;
      }
    });

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (scale.value > 1.05) {
        translateX.value = savedTranslateX.value + event.translationX;
        translateY.value = savedTranslateY.value + event.translationY;
        return;
      }
      if (Math.abs(event.translationY) > Math.abs(event.translationX)) {
        translateY.value = event.translationY;
        return;
      }
      pagerOffset.value = -pagerIndex.value * width + event.translationX;
    })
    .onEnd((event) => {
      if (scale.value > 1.05) {
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
        return;
      }
      const vertical =
        Math.abs(event.translationY) > Math.abs(event.translationX);
      if (vertical && event.translationY > CLOSE_THRESHOLD) {
        scheduleOnRN(onClose);
        return;
      }
      translateY.value = withTiming(0);
      let next = pagerIndex.value;
      if (event.translationX < -width * PAGE_THRESHOLD && next < photoCount - 1) {
        next += 1;
      } else if (event.translationX > width * PAGE_THRESHOLD && next > 0) {
        next -= 1;
      }
      pagerIndex.value = next;
      pagerOffset.value = withTiming(-next * width);
      if (next !== current) {
        scheduleOnRN(onIndexChange, next);
        scheduleOnRN(resetZoom);
      }
    });

  const composed = Gesture.Simultaneous(pinch, pan);

  const pagerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pagerOffset.value }],
  }));

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={styles.root}>
      <GestureDetector gesture={composed}>
        <Animated.View
          collapsable={false}
          style={[styles.pager, { height }, pagerStyle]}
        >
          {photos.map((photo) => (
            <Animated.View
              key={photo.id}
              style={[{ width, height }, imageStyle]}
            >
              <PhotoGalleryItem photo={photo} />
            </Animated.View>
          ))}
        </Animated.View>
      </GestureDetector>
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

function PhotoGallery({
  photos,
  index,
  onClose,
  sectionLicense,
}: PhotoGalleryProps) {
  const [current, setCurrent] = useState(Math.max(0, index));

  useEffect(() => {
    setCurrent(Math.max(0, index));
  }, [index]);

  if (index < 0 || photos.length === 0) {
    return null;
  }

  return (
    <Modal visible animationType="fade" onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider style={styles.root}>
          <PhotoGalleryInner
            photos={photos}
            current={current}
            onIndexChange={setCurrent}
            onClose={onClose}
            sectionLicense={sectionLicense}
          />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'black',
  },
  pager: {
    flexDirection: 'row',
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
