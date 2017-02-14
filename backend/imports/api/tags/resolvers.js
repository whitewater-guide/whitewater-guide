import {KayakingTags, HazardTags, MiscTags, SupplyTags} from './index';
export const tagsResolvers = {
  Query: {
    supplyTags: () => SupplyTags.find({}),
    kayakingTags: () => KayakingTags.find({}),
    hazardTags: () => HazardTags.find({}),
    miscTags: () => MiscTags.find({}),
  }
};