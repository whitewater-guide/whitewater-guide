import { useFormikContext } from 'formik';
import { useCallback, useRef } from 'react';

import type { SectionFormInput } from '../types';

export function useRemovePhoto() {
  const ctx = useFormikContext<SectionFormInput>();
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;

  return useCallback((index: number) => {
    const { values, setFieldValue } = ctxRef.current;
    const newMedia = values.media.slice();
    newMedia.splice(index, 1);
    setFieldValue('media', newMedia);
  }, []);
}
