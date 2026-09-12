import { useMemo } from 'react';

import type { Formulas, SectionForChart } from './types';

function identity(x: number | null): number | null {
  return x;
}

export function useFormulas(section?: SectionForChart): Formulas {
  return useMemo(() => {
    if (!section) {
      return { flows: identity, levels: identity };
    }
    return { levels: identity, flows: identity };
  }, [section]);
}
