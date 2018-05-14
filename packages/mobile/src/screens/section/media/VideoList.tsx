import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import VideoItem from './VideoItem';
import NoMedia from './NoMedia';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
});

const VideoList = ({ videos }) => {
  if (!videos || videos.length === 0) {
    return (
      <NoMedia type="videos" />
    );
  }
  return (
    <View style={styles.container}>
      { videos.map(video => (<VideoItem key={video.url} video={video} />)) }
    </View>
  );
};

VideoList.propTypes = {
  videos: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    url: PropTypes.string,
    copyright: PropTypes.string,
    description: PropTypes.string,
  })),
};

VideoList.defaultProps = {
  videos: null,
};

export default VideoList;
