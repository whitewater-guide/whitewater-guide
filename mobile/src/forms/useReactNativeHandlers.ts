import { FieldInputProps } from 'formik';
import { useCallback } from 'react';

const useReactNativeHandlers = <T = any>(
  field: FieldInputProps<T>,
  onBlurProp?: any,
) => {
  const onChange = useCallback(
    (value: T) => {
      const event = {
        target: {
          name: field.name,
          value,
        },
      };
      field.onChange(event);
    },
    [field.onChange],
  );
  const onBlur = useCallback(
    (e) => {
      if (onBlurProp) {
        onBlurProp(e);
      }
      const event = {
        target: {
          name: field.name,
        },
      };
      field.onBlur(event);
    },
    [field.onBlur, onBlurProp],
  );
  return { onChange, onBlur };
};

export default useReactNativeHandlers;
