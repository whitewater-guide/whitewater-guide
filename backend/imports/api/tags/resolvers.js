import { CollectionByCategory, KayakingTags, HazardsTags, MiscTags, SupplyTags } from './collection';

function upsertTag(root, data) {
  const { tag, language } = data;
  let { _id, category, ...tagData } = tag;
  const Collection = CollectionByCategory[category];
  if (_id)
    Collection.update(_id, { $set: tagData });
  else
    _id = Collection.insert(tagData);
  return Collection.findOne(_id);
}

function removeTag(root, { category, _id }) {
  return CollectionByCategory[category].remove(_id) > 0;
}

export const tagsResolvers = {
  Query: {
    supplyTags: () => SupplyTags.find({}),
    kayakingTags: () => KayakingTags.find({}),
    hazardsTags: () => HazardsTags.find({}),
    miscTags: () => MiscTags.find({}),
  },
  Mutation: {
    upsertTag,
    removeTag,
  },
};