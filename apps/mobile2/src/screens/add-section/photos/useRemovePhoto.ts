import { useFormikContext } from 'formik';
import { useCallback } from 'react';

import type { SectionFormInput } from '../types';

export function useRemovePhoto() {
  const { values, setFieldValue } = useFormikContext<SectionFormInput>();
  return useCallback(
    (index: number) => {
      const newMedia = values.media.slice();
      newMedia.splice(index, 1);
      setFieldValue('media', newMedia);
    },
    [values, setFieldValue],
  );
}
