import React, { useCallback, useMemo, useState } from 'react';
import {
  Platform,
  StatusBar,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Image from 'react-native-fast-image';
import theme from '../../theme';
import Icon from '../Icon';
import { PhotoGallery } from '../photo-gallery';
import { commonStyles } from './styles';
import { Photo } from './types';

const styles = StyleSheet.create({
  clear: {
    position: 'absolute',
    top: theme.margin.single,
    right: theme.margin.single,
  },
});

interface Props {
  value: Photo;
  onChange: (value: Photo | null) => void;
  style?: StyleProp<ViewStyle>;
}

const LocalPhoto: React.FC<Props> = ({ value, onChange, style }) => {
  const [index, setIndex] = useState(-1);
  const onOpen = useCallback(() => setIndex(0), [setIndex]);
  const onClose = useCallback(() => setIndex(-1), [setIndex]);
  const onClear = useCallback(() => onChange(null), [onChange]);
  const source = useMemo(() => ({ uri: value.image }), [value]);
  const galleryPhotos = useMemo(() => [value], [value]);
  return (
    <View>
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
        photos={galleryPhotos}
        ImageComponent={Image}
      />
    </View>
  );
};

LocalPhoto.displayName = 'LocalPhoto';

export default LocalPhoto;
