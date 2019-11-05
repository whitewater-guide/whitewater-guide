import { useEffect, useRef } from 'react';

export const useOnceTruthy = (effect: () => void, condition: boolean) => {
  const used = useRef(false);
  useEffect(() => {
    if (!used.current && condition) {
      used.current = true;
      effect();
    }
  }, [used, condition]);
};
