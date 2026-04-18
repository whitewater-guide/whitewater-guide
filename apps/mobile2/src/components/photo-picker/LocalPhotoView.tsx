import { LocalPhotoStatus } from '@whitewater-guide/clients';
import { useCallback, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import type { LocalPhoto } from '../../features/uploads';
import theme from '../../theme';
import Icon from '../Icon';

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  clear: {
    position: 'absolute',
    top: theme.margin.single,
    right: theme.margin.single,
  },
  fullscreen: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: theme.margin.double,
    right: theme.margin.single,
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderRadius: 16,
  },
});

interface Props {
  localPhotoId: string;
  value: LocalPhoto;
  onChange: (value: LocalPhoto | null) => void;
  style?: object;
  testID?: string;
}

function LocalPhotoView({
  value,
  onChange,
  style,
  localPhotoId,
  testID,
}: Props) {
  const [open, setOpen] = useState(false);
  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);

  const onClear = useCallback(
    () =>
      onChange({
        status: LocalPhotoStatus.READY,
        id: localPhotoId,
        resolution: [0, 0],
      }),
    [onChange, localPhotoId],
  );

  const uri = value.file ? value.file.uri : value.url;
  const source = uri ? { uri } : undefined;

  return (
    <View testID={testID}>
      <StatusBar hidden={Platform.OS === 'ios' && open} />
      <TouchableOpacity onPress={onOpen}>
        <Image
          style={[styles.image, style as any]}
          resizeMode="cover"
          source={source}
        />
      </TouchableOpacity>
      <Icon
        icon="close-circle"
        color={theme.colors.textLight}
        style={styles.clear}
        onPress={onClear}
      />
      <Modal visible={open} animationType="fade" onRequestClose={onClose}>
        <View style={styles.fullscreen}>
          <Image
            style={styles.fullscreenImage}
            resizeMode="contain"
            source={source}
          />
          <Icon
            icon="close"
            color="white"
            style={styles.closeButton}
            onPress={onClose}
          />
        </View>
      </Modal>
    </View>
  );
}

LocalPhotoView.displayName = 'LocalPhotoView';

export default LocalPhotoView;
