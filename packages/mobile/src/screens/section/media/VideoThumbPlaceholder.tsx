import type { FC } from 'react';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import Icon from '~/components/Icon';
import { PHOTO_PADDING, PHOTO_SIZE } from '~/features/media';
import theme from '~/theme';

const styles = StyleSheet.create({
  container: {
    margin: PHOTO_PADDING / 2,
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.border,
  },
});

const VideoThumbPlaceholder: FC = () => (
  <View style={styles.container}>
    <Icon icon="video" />
  </View>
);

export default VideoThumbPlaceholder;
