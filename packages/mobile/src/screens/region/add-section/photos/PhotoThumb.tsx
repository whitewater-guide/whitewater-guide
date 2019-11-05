import Icon from 'components/Icon';
import React, { useCallback } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { LocalPhoto } from '../../../../features/uploads';
import theme from '../../../../theme';
import Screens from '../../../screen-names';

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
  onClear: (index: number) => void;
}

const PhotoThumb: React.FC<Props> = React.memo(({ index, photo, onClear }) => {
  const uri = photo ? (photo.file ? photo.file.uri : photo.url) : undefined;
  const { navigate } = useNavigation();

  const onPress = useCallback(() => {
    if (photo) {
      navigate(Screens.Region.AddSection.Photo, {
        index,
        localPhotoId: photo.id,
      });
    }
  }, [navigate, index, photo]);

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
});

PhotoThumb.displayName = 'PhotoThumb';

export default PhotoThumb;
