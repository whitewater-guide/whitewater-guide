import type { MediaWithThumbFragment } from '@whitewater-guide/schema';
import { MediaKind } from '@whitewater-guide/schema';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import NoMedia from './NoMedia';
import VideoItem from './VideoItem';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
});

interface Props {
  videos?: MediaWithThumbFragment[];
}

const VideoList: React.FC<Props> = ({ videos }) => {
  if (!videos || videos.length === 0) {
    return <NoMedia kind={MediaKind.Video} />;
  }
  return (
    <View style={styles.container}>
      {videos.map((video) => (
        <VideoItem key={video.url} video={video} />
      ))}
    </View>
  );
};

export default VideoList;
