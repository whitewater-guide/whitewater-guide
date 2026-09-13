import type { Meta, StoryObj } from '@storybook/react-native';
import { MediaKind, type MediaWithThumbFragment } from '@whitewater-guide/schema';
import { StyleSheet, View } from 'react-native';

import PhotoGrid from './photo-grid';

const BASE_PHOTO: MediaWithThumbFragment = {
  __typename: 'Media',
  id: '1',
  kind: MediaKind.Photo,
  url: '',
  image: 'https://picsum.photos/seed/river1/400/400',
  thumb: 'https://picsum.photos/seed/river1/200/200',
  resolution: [400, 400],
  description: null,
  copyright: null,
  weight: null,
  license: null,
};

const PHOTOS: MediaWithThumbFragment[] = [
  { ...BASE_PHOTO, id: '1', thumb: 'https://picsum.photos/seed/r1/200/200' },
  { ...BASE_PHOTO, id: '2', thumb: 'https://picsum.photos/seed/r2/200/200' },
  { ...BASE_PHOTO, id: '3', thumb: 'https://picsum.photos/seed/r3/200/200' },
  { ...BASE_PHOTO, id: '4', thumb: 'https://picsum.photos/seed/r4/200/200' },
];

const meta = {
  title: 'Screens/Section/Media/PhotoGrid',
  component: PhotoGrid,
  decorators: [
    (Story) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof PhotoGrid>;

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
