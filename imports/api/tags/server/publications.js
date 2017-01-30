import {Meteor} from 'meteor/meteor';
import {HazardTags, KayakingTags, MiscTags, SupplyTags} from '../index';

Meteor.publish('tags.all', function() {
  return [
    SupplyTags.find({}),
    KayakingTags.find({}),
    HazardTags.find({}),
    MiscTags.find({}),
  ];
});
