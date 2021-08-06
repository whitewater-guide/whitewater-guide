interface HarvestStatusRaw {
  success: boolean;
  timestamp: string;
  next?: string;
  count?: number;
  error?: string;
}

export const harvestStatusResolvers = {
  count: ({ count }: HarvestStatusRaw) => count || 0,
  error: ({ error }: HarvestStatusRaw) => error || null,
  next: ({ next }: HarvestStatusRaw) => next || null,
};
