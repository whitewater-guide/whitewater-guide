import { useActionSheet } from '@expo/react-native-action-sheet';
import { LocalPhotoStatus } from '@whitewater-guide/clients';
import { nanoid } from 'nanoid/non-secure';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { ImageLibraryOptions } from 'react-native-image-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import type { LocalPhoto } from './types';

export const MAX_PHOTO_DIMENSION = 1920;

const options: ImageLibraryOptions = {
  mediaType: 'photo',
  quality: 0.8,
  maxWidth: MAX_PHOTO_DIMENSION,
  maxHeight: MAX_PHOTO_DIMENSION,
};

export const useImagePicker = (
  onSelect: (photo: LocalPhoto) => void,
  defaultId?: string,
) => {
  const { t } = useTranslation();
  const { showActionSheetWithOptions } = useActionSheet();

  return useCallback(() => {
    const id = defaultId || nanoid();

    showActionSheetWithOptions(
      {
        title: t('components:photoPicker.pickerTitle'),
        options: [
          t('components:photoPicker.pickerCamera'),
          t('components:photoPicker.pickerGallery'),
          t('commons:cancel'),
        ],
        cancelButtonIndex: 2,
      },
      async (i) => {
        if (i !== 0 && i !== 1) {
          return;
        }
        try {
          const result = await (i === 0 ? launchCamera : launchImageLibrary)(
            options,
          );
          if (result.didCancel || !result.assets?.length) {
            return;
          }
          const asset = result.assets[0];
          if (!asset.uri || !asset.width || !asset.height) {
            return;
          }
          onSelect({
            id,
            file: {
              name: asset.fileName || 'photo.jpg',
              uri: asset.uri,
              type: asset.type || 'image/jpeg',
              size: asset.fileSize,
            },
            status: LocalPhotoStatus.PICKING,
            resolution: [asset.width, asset.height],
          });
        } catch (e) {
          console.error('imagePicker', e);
        }
      },
    );
  }, [onSelect, defaultId, showActionSheetWithOptions, t]);
};
