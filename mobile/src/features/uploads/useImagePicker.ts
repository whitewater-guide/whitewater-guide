import { useActionSheet } from '@expo/react-native-action-sheet';
import { LocalPhotoStatus } from '@whitewater-guide/clients';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Callback,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import shortid from 'shortid';

import { trackError } from '~/core/errors';

import { LocalPhoto } from './types';

export const MAX_PHOTO_DIMENSION = 1920;
export const MAX_PHOTO_MEGAPIXELS = 1.92 * 1.92;

const options: ImageLibraryOptions = {
  mediaType: 'photo',
  quality: 0.8,
  maxWidth: MAX_PHOTO_DIMENSION,
  maxHeight: MAX_PHOTO_DIMENSION,
};

export const useImagePicker = (
  onSelect: (photo: LocalPhoto) => void,
  onPress?: (localPhotoId: string) => void,
  defaultId?: string,
) => {
  const { t } = useTranslation();
  const { showActionSheetWithOptions } = useActionSheet();

  return useCallback(() => {
    const id = defaultId || shortid();

    const onPick: Callback = (opts) => {
      const {
        fileName,
        uri,
        didCancel,
        errorCode,
        type,
        width,
        height,
        fileSize,
      } = opts;
      if (errorCode) {
        trackError('imagePicker', new Error(errorCode));
        return;
      }
      if (!uri || didCancel) {
        return; // cancelled
      }
      const file = {
        name: fileName || 'photo.jpg',
        uri,
        type: type || 'image/jpeg',
        size: fileSize,
      };
      onSelect({
        id,
        file,
        status: LocalPhotoStatus.PICKING,
        resolution: [width!, height!],
      });
    };

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
      (i) => {
        if (i === 0) {
          onPress?.(id);
          launchCamera(options, onPick);
        } else if (i === 1) {
          onPress?.(id);
          launchImageLibrary(options, onPick);
        }
      },
    );

    return id;
  }, [onPress, onSelect, defaultId, showActionSheetWithOptions, t]);
};
