import {SupplyTags, HazardTags, KayakingTags, MiscTags} from '../api/tags';
import {Meteor} from 'meteor/meteor';

//Currently, it is not possible to import Assets as an ES6 module.
//Any of the Assets methods below can simply be called directly in any Meteor server code.

Meteor.startup(() => {
  const supply = JSON.parse(Assets.getText('tags/supply.json'));
  const hazards = JSON.parse(Assets.getText('tags/hazards.json'));
  const kayaking = JSON.parse(Assets.getText('tags/kayaking.json'));
  const misc = JSON.parse(Assets.getText('tags/misc.json'));

  supply.tags.forEach((tag) => {
    SupplyTags.upsert({slug: tag.slug}, {$set: tag});
  });

  hazards.tags.forEach((tag) => {
    HazardTags.upsert({slug: tag.slug}, {$set: tag});
  });

  kayaking.tags.forEach((tag) => {
    KayakingTags.upsert({slug: tag.slug}, {$set: tag});
  });

  misc.tags.forEach((tag) => {
    MiscTags.upsert({slug: tag.slug}, {$set: tag});
  });
});
