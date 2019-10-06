import { useFormikContext } from 'formik';
import { useCallback } from 'react';

export default (fileField: string, resolutionField: string) => {
  const {
    values,
    setValues,
    touched,
    setTouched,
    validateForm,
  } = useFormikContext<any>();
  return useCallback(
    (filename?: string, resolution?: number[]) => {
      setValues({
        ...values,
        [fileField]: filename,
        [resolutionField]: resolution,
      });
      setTouched({
        ...touched,
        [fileField]: true,
        [resolutionField]: true,
      });
      validateForm().catch(() => {});
    },
    [
      values,
      setValues,
      touched,
      setTouched,
      validateForm,
      fileField,
      resolutionField,
    ],
  );
};
