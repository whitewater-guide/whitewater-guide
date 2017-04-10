import React from 'react';
import { storiesOf } from '@kadira/react-native-storybook';
import MediaItem from './MediaItem';

const SampleData = {
  _id: 'XA2KPfvJEgZPW3bQg',
  description: 'A go-pro video from Fermin Perez Larrea',
  copyright: null,
  url: 'https://www.youtube.com/watch?v=R2R0R2MYuFE',
  type: 'video',
  __typename: 'Media',
};

storiesOf('MediaItem')
  .add('Video', () => (
    <MediaItem data={SampleData} />
  ));
