import { GaugeBinding, Section } from '@whitewater-guide/commons';
import { Parser } from 'expr-eval';
import identity from 'lodash/identity';
import isNil from 'lodash/isNil';
import memoize from 'lodash/memoize';
import { useMemo } from 'react';

import { FlowFormula, Formulas } from './types';

const getRawFormula = memoize(
  (formula: string): FlowFormula => {
    try {
      const expression = Parser.parse(formula);
      return (x: number | null) => {
        return isNil(x) ? null : expression.evaluate({ x }) || 0;
      };
    } catch {
      return identity;
    }
  },
);

export const getBindingFormula = (
  binding?: GaugeBinding | null,
): FlowFormula => {
  if (!binding || !binding.formula) {
    return identity;
  }
  return getRawFormula(binding.formula);
};

export const useFormulas = (section?: Section): Formulas =>
  useMemo(() => {
    if (!section) {
      return { flows: identity, levels: identity };
    }
    return {
      levels: getBindingFormula(section.levels),
      flows: getBindingFormula(section.flows),
    };
  }, [section]);
