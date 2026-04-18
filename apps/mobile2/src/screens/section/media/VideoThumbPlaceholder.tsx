import { StyleSheet, View } from 'react-native';

import Icon from '../../../components/Icon';
import theme from '../../../theme';
import { PHOTO_PADDING, PHOTO_SIZE } from './mediaConstants';

function VideoThumbPlaceholder() {
  return (
    <View style={styles.container}>
      <Icon icon="video" />
    </View>
  );
}

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

export default VideoThumbPlaceholder;
