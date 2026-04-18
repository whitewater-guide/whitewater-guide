import { getVideoThumb } from '@whitewater-guide/clients';
import type { MediaWithThumbFragment } from '@whitewater-guide/schema';
import { useEffect, useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Row } from '../../../components/Row';
import theme from '../../../theme';
import { PHOTO_PADDING, PHOTO_SIZE } from './mediaConstants';
import VideoThumbPlaceholder from './VideoThumbPlaceholder';

interface Props {
  video: MediaWithThumbFragment;
}

function VideoItem({ video }: Props) {
  const [thumb, setThumb] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getVideoThumb(video.url, PHOTO_SIZE).then((result) => {
      if (!cancelled) setThumb(result?.thumb ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [video.url]);

  const onPress = () => {
    Linking.openURL(video.url).catch(() => {});
  };

  const { description, copyright } = video;

  return (
    <Pressable onPress={onPress}>
      <Row style={styles.container}>
        {thumb ? (
          <Image
            source={{ uri: thumb }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <VideoThumbPlaceholder />
        )}
        <View style={styles.body}>
          <Text
            variant="bodyMedium"
            numberOfLines={copyright ? 3 : 4}
            style={styles.description}
          >
            {description}
          </Text>
          {copyright ? (
            <Text
              variant="bodySmall"
              style={styles.copyright}
            >{`© ${copyright}`}</Text>
          ) : null}
        </View>
      </Row>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: PHOTO_PADDING / 2,
    height: PHOTO_SIZE + 2 * PHOTO_PADDING,
  },
  image: {
    margin: PHOTO_PADDING / 2,
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    backgroundColor: theme.colors.border,
  },
  body: {
    flex: 1,
    alignSelf: 'stretch',
    paddingLeft: PHOTO_PADDING / 2,
    justifyContent: 'center',
  },
  description: {
    flex: 1,
  },
  copyright: {
    color: theme.colors.textNote,
  },
});

export default VideoItem;
