import type { MediaWithThumbFragment } from '@whitewater-guide/schema';
import { MediaKind } from '@whitewater-guide/schema';
import { StyleSheet, View } from 'react-native';

import NoMedia from './NoMedia';
import VideoItem from './VideoItem';

interface Props {
  videos?: MediaWithThumbFragment[];
}

function VideoList({ videos }: Props) {
  if (!videos || videos.length === 0) {
    return <NoMedia kind={MediaKind.Video} />;
  }
  return (
    <View style={styles.container}>
      {videos.map((video) => (
        <VideoItem key={video.id} video={video} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
});

export default VideoList;
