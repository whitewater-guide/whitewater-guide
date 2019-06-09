import { FieldInputProps } from 'formik';
import { useCallback } from 'react';

const useReactNativeHandlers = <T = any>(field: FieldInputProps<T>) => {
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
  const onBlur = useCallback(() => {
    const event = {
      target: {
        name: field.name,
      },
    };
    field.onBlur(event);
  }, [field.onBlur]);
  return { onChange, onBlur };
};

export default useReactNativeHandlers;
