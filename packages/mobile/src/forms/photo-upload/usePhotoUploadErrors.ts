import { useFormikContext } from 'formik';
import omit from 'lodash/omit';
import { useCallback } from 'react';

export default (fileField: string, resolutionField: string) => {
  const { setErrors, errors } = useFormikContext<any>();
  const setPhotoUploadErrors = useCallback(
    (file?: any, resolution?: any) => {
      const newErrors = {
        ...omit(errors || {}, [fileField, resolutionField]),
        [fileField]: file,
        [resolutionField]: resolution,
      };
      setErrors(newErrors);
    },
    [errors, setErrors],
  );
  return setPhotoUploadErrors;
};
