import { LocalPhotoStatus } from '@whitewater-guide/clients';
import type { ImageStyle } from '@whitewater-guide/react-native-fast-image';
import Image from '@whitewater-guide/react-native-fast-image';
import React, { useCallback, useMemo, useState } from 'react';
import type { StyleProp } from 'react-native';
import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import type { LocalPhoto } from '../../features/uploads';
import theme from '../../theme';
import Icon from '../Icon';
import { PhotoGallery } from '../photo-gallery';
import { commonStyles } from './styles';

const styles = StyleSheet.create({
  clear: {
    position: 'absolute',
    top: theme.margin.single,
    right: theme.margin.single,
  },
});

interface Props {
  localPhotoId: string;
  value: LocalPhoto;
  onChange: (value: LocalPhoto | null) => void;
  style?: StyleProp<ImageStyle>;
  testID?: string;
}

const LocalPhotoView: React.FC<Props> = ({
  value,
  onChange,
  style,
  localPhotoId,
  testID,
}) => {
  const [index, setIndex] = useState(-1);
  const onOpen = useCallback(() => setIndex(0), [setIndex]);
  const onClose = useCallback(() => setIndex(-1), [setIndex]);
  const onClear = useCallback(
    () =>
      onChange({
        status: LocalPhotoStatus.READY,
        id: localPhotoId,
        resolution: [0, 0],
      }),
    [onChange, localPhotoId],
  );
  const { source, gallery } = useMemo(() => {
    const { file, url, resolution } = value;
    return {
      source: { uri: file ? file.uri : url },
      gallery: [
        {
          image: (file ? file.uri : url) || null,
          resolution: file ? resolution : null,
        },
      ],
    };
  }, [value]);
  return (
    <View testID={testID}>
      <StatusBar hidden={Platform.OS === 'ios' && index >= 0} />
      <TouchableOpacity onPress={onOpen}>
        <Image
          style={[commonStyles.root, style]}
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
      <PhotoGallery
        index={index}
        onClose={onClose}
        photos={gallery}
        ImageComponent={Image}
      />
    </View>
  );
};

LocalPhotoView.displayName = 'LocalPhotoView';

export default LocalPhotoView;
