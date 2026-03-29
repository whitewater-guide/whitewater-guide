import type { FieldInputProps } from 'formik';
import { useMemo } from 'react';

const useReactNativeHandlers = <T = any>(
  { name, onChange, onBlur }: FieldInputProps<T>,
  onBlurProp?: any,
) =>
  useMemo(
    () => ({
      onChange: (value: T) => {
        const event = {
          target: {
            name,
            value,
          },
        };
        onChange(event);
      },
      onBlur: (e: any) => {
        if (onBlurProp) {
          onBlurProp(e);
        }
        const event = {
          target: {
            name,
          },
        };
        onBlur(event);
      },
    }),
    [name, onChange, onBlur, onBlurProp],
  );

export default useReactNativeHandlers;
