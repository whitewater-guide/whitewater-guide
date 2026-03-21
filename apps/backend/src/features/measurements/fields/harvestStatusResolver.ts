import type { Status } from '@whitewater-guide/gorge';

import type { HarvestStatusResolvers } from '../../../apollo/index';

export const harvestStatusResolvers: HarvestStatusResolvers = {
  count: ({ count }: Status) => count || 0,
  error: ({ error }: Status) => error || null,
  lastSuccess: ({ lastSuccess }: Status) => lastSuccess || null,
  nextRun: ({ nextRun }: Status) => nextRun || null,
  // deprecated
  success: ({ error }: Status) => !error,
  // deprecated, renamed to nextRun
  next: ({ nextRun }: Status) => nextRun || null,
  // deprecated, renamed to lastRun
  timestamp: ({ lastRun }: Status) => lastRun,
};
