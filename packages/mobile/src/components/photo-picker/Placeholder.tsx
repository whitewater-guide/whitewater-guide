import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Subheading } from 'react-native-paper';
import { PaperTheme } from '../../theme';
import { Icon } from '../Icon';
import { commonStyles } from './styles';
import { ImagePickerOptions, Photo } from './types';

const styles = StyleSheet.create({
  placeholder: {
    color: PaperTheme.colors.placeholder,
  },
});

interface Props {
  onChange: (value: Photo | null) => void;
  label?: string;
}

const Placeholder: React.FC<Props> = (props) => {
  const { onChange, label = 'components:photoPicker.placeholder' } = props;
  const { t } = useTranslation();
  const pickerOptions: ImagePickerOptions = useMemo<ImagePickerOptions>(
    () => ({
      title: t('components:photoPicker.pickerTitle'),
      cancelButtonTitle: t('commons:cancel'),
      takePhotoButtonTitle: t('components:photoPicker.pickerCamera'),
      chooseFromLibraryButtonTitle: t('components:photoPicker.pickerGallery'),
      mediaType: 'photo',
      noData: true,
      storageOptions: {
        skipBackup: true,
        cameraRoll: true,
      },
      quality: 0.8,
      maxWidth: 2000,
      maxHeight: 2000,
    }),
    [t],
  );
  const onPress = useCallback(() => {
    ImagePicker.showImagePicker(pickerOptions, (opts) => {
      const { fileName, uri, type, width, height } = opts;
      if (!uri) {
        return; // cancelled
      }
      onChange({
        name: fileName || 'photo.jpg',
        image: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
        type: type || 'image/jpeg',
        resolution: [width, height],
      });
    });
  }, [onChange]);
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={commonStyles.root}>
        <Icon
          icon="cloud-upload"
          color={PaperTheme.colors.placeholder}
          narrow={true}
        />
        <Subheading style={styles.placeholder}>{t(label)}</Subheading>
      </View>
    </TouchableOpacity>
  );
};

Placeholder.displayName = 'Placeholder';

export default Placeholder;
