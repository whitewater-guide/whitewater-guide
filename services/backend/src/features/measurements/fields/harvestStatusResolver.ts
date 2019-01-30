import { FieldResolvers } from '@apollo';
import { HarvestStatus } from '@whitewater-guide/commons';

interface HarvestStatusRaw {
  success: boolean;
  timestamp: string;
  count?: number;
  error?: string;
}

export const harvestStatusResolvers: FieldResolvers<
  HarvestStatusRaw,
  HarvestStatus
> = {
  count: ({ count }) => count || 0,
  error: ({ error }) => error || null,
};
