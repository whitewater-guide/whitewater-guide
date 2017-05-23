import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { registerRemovalHooks } from './hooks';

const tagsSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
  },
  slug: {
    type: String,
    label: 'URL Slug',
    unique: true,
    index: true,
  },
});

export const SupplyTags = new Mongo.Collection('supply_tags');
SupplyTags.attachSchema(tagsSchema);
registerRemovalHooks(SupplyTags, 'supplyTagIds');

export const KayakingTags = new Mongo.Collection('kayaking_tags');
KayakingTags.attachSchema(tagsSchema);
registerRemovalHooks(KayakingTags, 'kayakingTagIds');

export const HazardsTags = new Mongo.Collection('hazard_tags');
HazardsTags.attachSchema(tagsSchema);
registerRemovalHooks(HazardsTags, 'hazardsTagIds');

export const MiscTags = new Mongo.Collection('misc_tags');
MiscTags.attachSchema(tagsSchema);
registerRemovalHooks(MiscTags, 'miscTagIds');

export const CollectionByCategory = {
  KayakingTags,
  HazardsTags,
  MiscTags,
  SupplyTags,
};
