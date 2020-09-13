import { HarvestStatus } from '@whitewater-guide/commons';

import { FieldResolvers } from '~/apollo';

interface HarvestStatusRaw {
  success: boolean;
  timestamp: string;
  next?: string;
  count?: number;
  error?: string;
}

export const harvestStatusResolvers: FieldResolvers<
  HarvestStatusRaw,
  HarvestStatus
> = {
  count: ({ count }) => count || 0,
  error: ({ error }) => error || null,
  next: ({ next }) => next || null,
};
