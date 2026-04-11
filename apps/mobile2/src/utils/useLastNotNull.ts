import { useEffect, useState } from 'react';

type Nullable<T> = T | null;

function useLastNotNull<T>(value: Nullable<T>): Nullable<T> {
  const [state, setState] = useState<Nullable<T>>(value);
  useEffect(() => {
    if (value !== null) {
      setState(value);
    }
  }, [value]);
  return state;
}

export default useLastNotNull;
