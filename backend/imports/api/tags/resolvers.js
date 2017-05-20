import {KayakingTags, hazardsTags, MiscTags, SupplyTags} from './index';
export const tagsResolvers = {
  Query: {
    supplyTags: () => SupplyTags.find({}),
    kayakingTags: () => KayakingTags.find({}),
    hazardsTags: () => hazardsTags.find({}),
    miscTags: () => MiscTags.find({}),
  }
};