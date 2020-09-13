import { LocalPhotoStatus } from '@whitewater-guide/clients';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ImagePicker from 'react-native-image-picker';
import shortid from 'shortid';

import { trackError } from '~/core/errors';

import { LocalPhoto } from './types';

export const MAX_PHOTO_DIMENSION = 1920;
export const MAX_PHOTO_MEGAPIXELS = 1.92 * 1.92;

export const useImagePicker = (
  callback: (photo: LocalPhoto) => void,
  defaultId?: string,
) => {
  const { t } = useTranslation();
  return useCallback(() => {
    const id = defaultId || shortid();
    ImagePicker.showImagePicker(
      {
        title: t('components:photoPicker.pickerTitle'),
        cancelButtonTitle: t('commons:cancel'),
        takePhotoButtonTitle: t('components:photoPicker.pickerCamera'),
        chooseFromLibraryButtonTitle: t('components:photoPicker.pickerGallery'),
        mediaType: 'photo',
        noData: true,
        storageOptions: {
          skipBackup: true,
          cameraRoll: false,
        },
        quality: 0.8,
        maxWidth: MAX_PHOTO_DIMENSION,
        maxHeight: MAX_PHOTO_DIMENSION,
      },
      (opts) => {
        const {
          fileName,
          uri,
          didCancel,
          error,
          type,
          width,
          height,
          fileSize,
        } = opts;
        if (error) {
          trackError('imagePicker', new Error(error));
          return;
        }
        if (!uri || didCancel) {
          return; // cancelled
        }
        const file = {
          name: fileName || 'photo.jpg',
          // uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
          uri,
          type: type || 'image/jpeg',
          size: fileSize,
        };
        // ideally we would like to have event between user pressing button and photo being returned
        // but this is not possible with current image-picker ui
        // so LocalPhotoStatus.PICKING and LocalPhotoStatus.UPLOADING will happen almost instantly one after another
        callback({
          id,
          file,
          status: LocalPhotoStatus.PICKING,
          resolution: [width, height],
        });
      },
    );
    return id;
  }, [callback, defaultId, t]);
};
