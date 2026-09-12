import { useEffect, useState } from 'react';

export function useLastNotNull<T>(value: T | null): T | null {
  const [state, setState] = useState<T | null>(value);
  useEffect(() => {
    if (value !== null) {
      setState(value);
    }
  }, [value]);
  return state;
}
