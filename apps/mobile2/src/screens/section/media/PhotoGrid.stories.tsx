import type { Meta, StoryObj } from '@storybook/react';
import type { MediaKind } from '@whitewater-guide/schema';
import { StyleSheet, View } from 'react-native';

import PhotoGrid from './PhotoGrid';

const BASE_PHOTO = {
  __typename: 'Media' as const,
  id: '1',
  kind: 'photo' as MediaKind,
  url: '',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  image: 'https://picsum.photos/seed/river1/400/400',
  thumb: 'https://picsum.photos/seed/river1/200/200',
  resolution: [400, 400],
  description: null,
  copyright: null,
  weight: null,
  license: null,
};

const PHOTOS = [
  { ...BASE_PHOTO, id: '1', thumb: 'https://picsum.photos/seed/r1/200/200' },
  { ...BASE_PHOTO, id: '2', thumb: 'https://picsum.photos/seed/r2/200/200' },
  { ...BASE_PHOTO, id: '3', thumb: 'https://picsum.photos/seed/r3/200/200' },
  { ...BASE_PHOTO, id: '4', thumb: 'https://picsum.photos/seed/r4/200/200' },
];

const meta: Meta<typeof PhotoGrid> = {
  title: 'Screens/Section/Media/PhotoGrid',
  component: PhotoGrid,
  decorators: [
    (Story) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SinglePhoto: Story = {
  args: {
    photos: [BASE_PHOTO],
    onPress: () => {},
  },
};

export const FourPhotos: Story = {
  args: {
    photos: PHOTOS,
    onPress: () => {},
  },
};

export const Empty: Story = {
  args: {
    photos: [],
    onPress: () => {},
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
