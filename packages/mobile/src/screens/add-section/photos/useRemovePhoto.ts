import { SectionInput } from '@whitewater-guide/commons';
import { useFormikContext } from 'formik';
import { useCallback } from 'react';

export const useRemovePhoto = () => {
  const { values, setFieldValue } = useFormikContext<SectionInput>();
  return useCallback(
    (index: number) => {
      const newMedia = values.media.slice();
      newMedia.splice(index, 1);
      setFieldValue('media', newMedia);
    },
    [values, setFieldValue],
  );
};
