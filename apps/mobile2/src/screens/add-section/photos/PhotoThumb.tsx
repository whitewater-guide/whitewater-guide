import { useNavigation } from '@react-navigation/native';
import { memo, useCallback } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from '../../../components/Icon';
import { Screens } from '../../../core/navigation';
import type { LocalPhoto } from '../../../features/uploads';
import theme from '../../../theme';

const screenWidth = Dimensions.get('window').width;
const TILE_SIZE = (screenWidth - 4 * theme.margin.single) / 3;

const styles = StyleSheet.create({
  image: {
    width: TILE_SIZE,
    height: TILE_SIZE,
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

function PhotoThumb({ index, photo, onClear }: Props) {
  const navigation = useNavigation();
  const uri = photo ? (photo.file ? photo.file.uri : photo.url) : undefined;

  const onPress = useCallback(() => {
    if (photo) {
      navigation.navigate(Screens.ADD_SECTION_PHOTO, {
        index,
        localPhotoId: photo.id,
      });
    }
  }, [navigation, index, photo]);

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
}

export default memo(PhotoThumb);
