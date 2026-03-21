import type { GaugeBindingResolvers } from '../../../apollo/index';

export const gaugeBindingResolver: GaugeBindingResolvers = {
  minimum: ({ minimum }) => minimum || null,
  optimum: ({ optimum }) => optimum || null,
  maximum: ({ maximum }) => maximum || null,
  impossible: ({ impossible }) => impossible || null,
  approximate: ({ approximate }) => !!approximate,
  formula: ({ formula }) => formula || null,
};
