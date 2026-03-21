import type { PointInput } from '@whitewater-guide/schema';
import { useFormikContext } from 'formik';
import isNil from 'lodash/isNil';
import { useEffect } from 'react';
import usePrevious from 'react-use/lib/usePrevious';

function isNilCoordinates(coordinates?: unknown[] | null): boolean {
  return isNil(coordinates) || coordinates.every(isNil);
}

/**
 * This hook will transform [undefined, undefined, undefined]
 * coordinates to null when item becomes undefined
 * @param name
 * @returns
 */
export default function useNilCoordinates(name: string) {
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
}
