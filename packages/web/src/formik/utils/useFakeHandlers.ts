import { isInputEvent, useField, useFormikContext } from 'formik';
import { useMemo } from 'react';

export interface FakeHandlers {
  onChange: (eventOrValue: unknown) => void;
  onBlur: (eventOrValue: unknown) => void;
}

export function useFakeHandlers(name: string): FakeHandlers {
  const [field] = useField(name);
  const { onChange, onBlur } = field;
  const { setFieldValue, setFieldTouched } = useFormikContext<unknown>();

  return useMemo(
    () => ({
      onBlur: (eventOrValue: unknown) => {
        if (isInputEvent(eventOrValue)) {
          onBlur(eventOrValue);
        } else {
          setFieldTouched(name, true);
        }
      },
      onChange: (eventOrValue: unknown) => {
        if (isInputEvent(eventOrValue)) {
          onChange(eventOrValue);
        } else {
          setFieldValue(name, eventOrValue);
        }
      },
    }),
    [name, onChange, onBlur, setFieldTouched, setFieldValue],
  );
}
