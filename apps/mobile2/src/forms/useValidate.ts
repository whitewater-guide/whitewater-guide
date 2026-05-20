import { createSafeValidator } from '@whitewater-guide/validation';
import { useMemo } from 'react';
import type { Schema } from 'yup';

// Cannot use validation schema directly due to https://github.com/jaredpalmer/formik/issues/1697
const useValidate = (validationSchema?: Schema<any>) =>
  useMemo(
    () => validationSchema && (createSafeValidator(validationSchema) as any),
    [validationSchema],
  );

export default useValidate;
