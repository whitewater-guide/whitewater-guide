import React, { useCallback } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from '~/components/Icon';
import { Screens } from '~/core/navigation';
import { LocalPhoto } from '~/features/uploads';
import theme from '~/theme';
import { AddSectionPhotosNavProp } from './types';

const styles = StyleSheet.create({
  image: {
    width: (theme.screenWidth - 4 * theme.margin.single) / 3,
    height: (theme.screenWidth - 4 * theme.margin.single) / 3,
    margin: theme.margin.half,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clear: {
    position: 'absolute',
    top: theme.margin.single,
    right: theme.margin.single,
  },
});

interface Props {
  index: number;
  photo?: LocalPhoto;
  navigation: AddSectionPhotosNavProp;
  onClear: (index: number) => void;
}

const PhotoThumb: React.FC<Props> = React.memo(
  ({ index, photo, onClear, navigation }) => {
    const uri = photo ? (photo.file ? photo.file.uri : photo.url) : undefined;

    const onPress = useCallback(() => {
      if (photo) {
        navigation.navigate(Screens.ADD_SECTION_PHOTO, {
          index,
          localPhotoId: photo.id,
        });
      }
    }, [navigation.navigate, index, photo]);

    const onRemove = useCallback(() => {
      onClear(index);
    }, [index, onClear]);

    return (
      <View>
        <TouchableOpacity onPress={onPress}>
          <Image source={{ uri }} style={styles.image} />
        </TouchableOpacity>
        <Icon
          icon="close-circle"
          color={theme.colors.textLight}
          style={styles.clear}
          onPress={onRemove}
        />
      </View>
    );
  },
);

PhotoThumb.displayName = 'PhotoThumb';

export default PhotoThumb;
