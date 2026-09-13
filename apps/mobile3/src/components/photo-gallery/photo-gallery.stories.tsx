import type { Meta, StoryObj } from '@storybook/react-native';
import type { License } from '@whitewater-guide/schema';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { StoryButton } from '@/storybook/smoke-tests/story-ui';

import PhotoGallery from './photo-gallery';
import type { GalleryPhoto } from './photo-gallery-item';

export interface GalleryDemoProps {
  photos: GalleryPhoto[];
  sectionLicense?: License;
}

function GalleryDemo({ photos, sectionLicense }: GalleryDemoProps) {
  const [index, setIndex] = useState(-1);
  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <StoryButton label="Open Gallery" onPress={() => setIndex(0)} />
      </View>
      <PhotoGallery
        photos={photos}
        index={index}
        onClose={() => setIndex(-1)}
        sectionLicense={sectionLicense}
      />
    </View>
  );
}

const BASE_PHOTO: GalleryPhoto = {
  id: '1',
  image: 'https://picsum.photos/seed/river1/1200/800',
  description: null,
  copyright: null,
  license: null,
};

const PHOTOS: GalleryPhoto[] = [
  {
    ...BASE_PHOTO,
    id: '1',
    image: 'https://picsum.photos/seed/river1/1200/800',
  },
  {
    ...BASE_PHOTO,
    id: '2',
    image: 'https://picsum.photos/seed/river2/800/1200',
  },
  {
    ...BASE_PHOTO,
    id: '3',
    image: 'https://picsum.photos/seed/river3/1024/768',
  },
];

const CC_BY: License = {
  __typename: 'License',
  name: 'Creative Commons Attribution',
  slug: 'CC_BY',
  url: 'https://creativecommons.org/licenses/by/4.0/',
};

const meta = {
  title: 'Components/PhotoGallery',
  component: GalleryDemo,
} satisfies Meta<typeof GalleryDemo>;

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

export const MultiplePhotosWithMetadata: Story = {
  args: {
    photos: [
      {
        ...BASE_PHOTO,
        id: '6',
        image: 'https://picsum.photos/seed/river1/1200/800',
        description: 'Upper Gorge at high water — class IV rapid',
        copyright: 'Alice Rivers',
        license: CC_BY,
      },
      {
        ...BASE_PHOTO,
        id: '7',
        image: 'https://picsum.photos/seed/river2/800/1200',
        description: 'Drop into the canyon, vertical shot',
        copyright: 'Bob Paddler',
        license: CC_BY,
      },
      {
        ...BASE_PHOTO,
        id: '8',
        image: 'https://picsum.photos/seed/river3/1024/768',
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
        license: CC_BY,
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
        license: CC_BY,
      },
    ],
  },
};

export const Closed: Story = {
  args: { photos: [BASE_PHOTO] },
  render: () => (
    <PhotoGallery photos={[BASE_PHOTO]} index={-1} onClose={() => {}} />
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
