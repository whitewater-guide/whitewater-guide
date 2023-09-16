import type {
  GaugeBindingAllFragment,
  SectionFlowsFragment,
} from '@whitewater-guide/schema';
import { Parser } from 'expr-eval';
import identity from 'lodash/identity';
import isNil from 'lodash/isNil';
import memoize from 'lodash/memoize';
import { useMemo } from 'react';

import type { FlowFormula, Formulas } from './types';

const getRawFormula = memoize((formula: string): FlowFormula => {
  try {
    const expression = Parser.parse(formula);
    return (x: number | null) =>
      isNil(x) ? null : expression.evaluate({ x }) || 0;
  } catch {
    return identity;
  }
});

export const getBindingFormula = (
  binding?: GaugeBindingAllFragment | null,
): FlowFormula => {
  if (!binding || !binding.formula) {
    return identity;
  }
  return getRawFormula(binding.formula);
};

export const useFormulas = (
  section?: Omit<SectionFlowsFragment, 'flowsText'>,
): Formulas =>
  useMemo(() => {
    if (!section) {
      return { flows: identity, levels: identity };
    }
    return {
      levels: getBindingFormula(section.levels),
      flows: getBindingFormula(section.flows),
    };
  }, [section]);
