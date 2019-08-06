import { createSafeValidator } from '@whitewater-guide/commons';
import { useMemo } from 'react';
import * as yup from 'yup';

// TODO: cannot use validation scheme directly due to this https://github.com/jaredpalmer/formik/issues/1697
// any is because validate function can return error (https://github.com/jaredpalmer/formik/blob/217a49e6243a41a318a8973d18a7e1535b7880d5/src/Formik.tsx#L168)
export const useValidate = (validationSchema?: yup.Schema<any>) =>
  useMemo(
    () => validationSchema && (createSafeValidator(validationSchema) as any),
    [validationSchema],
  );
