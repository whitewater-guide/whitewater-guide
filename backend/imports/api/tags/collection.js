import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

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

export const KayakingTags = new Mongo.Collection('kayaking_tags');
KayakingTags.attachSchema(tagsSchema);

export const hazardsTags = new Mongo.Collection('hazard_tags');
hazardsTags.attachSchema(tagsSchema);

export const MiscTags = new Mongo.Collection('misc_tags');
MiscTags.attachSchema(tagsSchema);