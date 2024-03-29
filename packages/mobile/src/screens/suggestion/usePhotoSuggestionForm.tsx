import type { FormikHelpers } from 'formik';
import { useCallback, useMemo } from 'react';

import useValidate from '~/forms/useValidate';

import { useLocalPhotos } from '../../features/uploads';
import type { PhotoSuggestion } from './types';
import useAddSuggestion from './useAddSuggestion';
import { PhotoSuggestionInputSchema } from './validation';

export default (sectionId: string, localPhotoId: string) => {
  const { localPhotos } = useLocalPhotos();
  const addSuggestion = useAddSuggestion();
  const validate = useValidate(PhotoSuggestionInputSchema);
  const initialValues: PhotoSuggestion = useMemo(
    () => ({
      section: {
        id: sectionId,
      },
      photo: localPhotos[localPhotoId],
      description: null,
      copyright: null,
    }),
    [localPhotos, localPhotoId, sectionId],
  );
  const onSubmit = useCallback(
    (suggestion: PhotoSuggestion, helpers: FormikHelpers<any>) => {
      const { photo, ...rest } = suggestion;
      return photo.url
        ? addSuggestion(
            {
              ...rest,
              filename: photo.url,
              resolution: photo.resolution,
            },
            helpers,
          )
        : undefined;
    },
    [addSuggestion],
  );
  return {
    validate,
    onSubmit,
    initialValues,
  };
};
