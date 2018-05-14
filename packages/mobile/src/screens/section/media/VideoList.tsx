import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Media, MediaKind } from '../../../ww-commons';
import NoMedia from './NoMedia';
import VideoItem from './VideoItem';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
});

interface Props {
  videos?: Media[];
}

const VideoList: React.SFC<Props> = ({ videos }) => {
  if (!videos || videos.length === 0) {
    return (
      <NoMedia kind={MediaKind.video} />
    );
  }
  return (
    <View style={styles.container}>
      {videos.map((video) => (<VideoItem key={video.url} video={video} />))}
    </View>
  );
};

export default VideoList;
