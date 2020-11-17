import { useField, useFormikContext } from 'formik';
import { useMemo } from 'react';

export interface FakeHandlers {
  onChange: (eventOrValue: any) => void;
  onBlur: (eventOrValue: any) => void;
}

const isEvent = (event: any) =>
  event && (event instanceof Event || event.nativeEvent instanceof Event);

export function useFakeHandlers(name: string): FakeHandlers {
  const [field] = useField(name);
  const { onChange, onBlur } = field;
  const { setFieldValue, setFieldTouched } = useFormikContext<any>();

  return useMemo(
    () => ({
      onBlur: (eventOrValue: any) => {
        if (isEvent(eventOrValue)) {
          onBlur(eventOrValue);
        } else {
          setFieldTouched(name, true);
        }
      },
      onChange: (eventOrValue: any) => {
        if (isEvent(eventOrValue)) {
          onChange(eventOrValue);
        } else {
          setFieldValue(name, eventOrValue);
        }
      },
    }),
    [name, onChange, onBlur, setFieldTouched, setFieldValue],
  );
}
