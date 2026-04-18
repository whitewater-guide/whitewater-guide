import type { Meta, StoryObj } from '@storybook/react';
import type { MediaKind } from '@whitewater-guide/schema';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import PhotoGallery from './PhotoGallery';

type GalleryProps = ComponentProps<typeof PhotoGallery>;

function GalleryDemo(props: Omit<GalleryProps, 'index' | 'onClose'>) {
  const [index, setIndex] = useState(-1);
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <View style={styles.content}>
          <Button mode="contained" onPress={() => setIndex(0)}>
            Open Gallery
          </Button>
        </View>
        <PhotoGallery {...props} index={index} onClose={() => setIndex(-1)} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const BASE_PHOTO = {
  __typename: 'Media' as const,
  id: '1',
  kind: 'photo' as MediaKind,
  url: '',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  image: 'https://picsum.photos/seed/river1/1200/800',
  resolution: [1200, 800],
  description: null,
  copyright: null,
  license: null,
};

const PHOTOS = [
  {
    ...BASE_PHOTO,
    id: '1',
    image: 'https://picsum.photos/seed/river1/1200/800',
    resolution: [1200, 800],
  },
  {
    ...BASE_PHOTO,
    id: '2',
    image: 'https://picsum.photos/seed/river2/800/1200',
    resolution: [800, 1200],
  },
  {
    ...BASE_PHOTO,
    id: '3',
    image: 'https://picsum.photos/seed/river3/1024/768',
    resolution: [1024, 768],
  },
];

const meta: Meta<typeof GalleryDemo> = {
  title: 'Components/PhotoGallery',
  component: GalleryDemo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SinglePhoto: Story = {
  args: {
    photos: [BASE_PHOTO],
  },
};

export const MultiplePhotos: Story = {
  args: {
    photos: PHOTOS,
  },
};

const CC_BY = {
  __typename: 'License' as const,
  name: 'Creative Commons Attribution',
  slug: 'cc-by',
  url: 'https://creativecommons.org/licenses/by/4.0/',
};

export const MultiplePhotosWithMetadata: Story = {
  args: {
    photos: [
      {
        ...BASE_PHOTO,
        id: '6',
        image: 'https://picsum.photos/seed/river1/1200/800',
        resolution: [1200, 800],
        description: 'Upper Gorge at high water — class IV rapid',
        copyright: 'Alice Rivers',
        license: CC_BY,
      },
      {
        ...BASE_PHOTO,
        id: '7',
        image: 'https://picsum.photos/seed/river2/800/1200',
        resolution: [800, 1200],
        description: 'Drop into the canyon, vertical shot',
        copyright: 'Bob Paddler',
        license: CC_BY,
      },
      {
        ...BASE_PHOTO,
        id: '8',
        image: 'https://picsum.photos/seed/river3/1024/768',
        resolution: [1024, 768],
        description: 'Exit pool after the main drop',
        copyright: null,
        license: CC_BY,
      },
    ],
  },
};

export const WithLicenseAndDescription: Story = {
  args: {
    photos: [
      {
        ...BASE_PHOTO,
        id: '4',
        description: 'Upper Gorge at high water',
        copyright: 'John Doe',
        license: {
          __typename: 'License',
          name: 'Creative Commons Attribution',
          slug: 'cc-by',
          url: 'https://creativecommons.org/licenses/by/4.0/',
        },
      },
    ],
  },
};

export const LicenseOnly: Story = {
  args: {
    photos: [
      {
        ...BASE_PHOTO,
        id: '5',
        description: null,
        copyright: null,
        license: {
          __typename: 'License',
          name: 'Creative Commons Attribution',
          slug: 'cc-by',
          url: 'https://creativecommons.org/licenses/by/4.0/',
        },
      },
    ],
  },
};

export const Closed: Story = {
  render: () => (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <PhotoGallery photos={[BASE_PHOTO]} index={-1} onClose={() => {}} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  ),
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
