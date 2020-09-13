import {
  i18nizeUploadError,
  LocalPhotoStatus,
  useUploadLink,
} from '@whitewater-guide/clients';
import React, { useCallback, useContext, useState } from 'react';

import { trackError } from '../../core/errors';
import { LocalPhoto } from './types';

interface UploadsContext {
  upload: (photo: LocalPhoto) => Promise<void>;
  localPhotos: Record<string, LocalPhoto>;
}

const PhotosContext = React.createContext<UploadsContext>({
  upload: () => Promise.resolve(),
  localPhotos: {},
});

export const UploadsProvider: React.FC = React.memo(({ children }) => {
  const [localPhotos, setLocalPhotos] = useState<Record<string, LocalPhoto>>(
    {},
  );
  const link = useUploadLink();

  const upload = useCallback(
    (photo: LocalPhoto) => {
      const id = photo.id;
      setLocalPhotos((photos) => ({
        ...photos,
        [id]: {
          ...photo,
          status: photo.file
            ? LocalPhotoStatus.UPLOADING
            : LocalPhotoStatus.READY,
        },
      }));
      if (photo.file) {
        return link
          .upload(photo.file)
          .then((url) => {
            setLocalPhotos((photos) => ({
              ...photos,
              [id]: {
                ...photos[id],
                status: LocalPhotoStatus.READY,
                url,
              },
            }));
          })
          .catch((e) => {
            trackError('photo-uploader', e);
            setLocalPhotos((photos) => ({
              ...photos,
              [id]: {
                ...photos[id],
                status: LocalPhotoStatus.READY,
                error: i18nizeUploadError(e),
              },
            }));
          });
      }
      return Promise.resolve();
    },
    [setLocalPhotos, link],
  );

  return (
    <PhotosContext.Provider value={{ localPhotos, upload }}>
      {children}
    </PhotosContext.Provider>
  );
});

UploadsProvider.displayName = 'UploadsProvider';

export const useLocalPhotos = () => useContext(PhotosContext);
