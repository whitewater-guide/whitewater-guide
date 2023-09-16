import { createSafeValidator } from '@whitewater-guide/validation';
import { useMemo } from 'react';
import type { Schema } from 'yup';

// TODO: cannot use validation scheme directly due to this https://github.com/jaredpalmer/formik/issues/1697
// any is because validate function can return error (https://github.com/jaredpalmer/formik/blob/217a49e6243a41a318a8973d18a7e1535b7880d5/src/Formik.tsx#L168)
const useValidate = (validationSchema?: Schema<any>) =>
  useMemo(
    () => validationSchema && (createSafeValidator(validationSchema) as any),
    [validationSchema],
  );

export default useValidate;
