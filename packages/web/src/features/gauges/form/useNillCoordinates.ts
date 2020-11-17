import { usePrevious } from '@whitewater-guide/clients';
import { isNilCoordinates, PointInput } from '@whitewater-guide/commons';
import { useFormikContext } from 'formik';
import { useEffect } from 'react';

// This hook will transform [undefined, undefined, undefined]
// coordinates to null when item becomes undefined
const useNilCoordinates = (name: string) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const value: PointInput = values[name];
  const prevValue = usePrevious(value);

  return useEffect(() => {
    if (
      value &&
      isNilCoordinates(value.coordinates) &&
      (!prevValue || !isNilCoordinates(prevValue.coordinates))
    ) {
      setFieldValue(name, null);
    }
  }, [name, prevValue, value, setFieldValue]);
};

export default useNilCoordinates;
