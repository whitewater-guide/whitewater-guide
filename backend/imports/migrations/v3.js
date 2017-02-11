import {Sections, Durations} from '../api/sections';
import {Meteor} from "meteor/meteor";

/**
 * Convert section duration from string enum to number, for better sorting
 */
export default {
  version: 3,
  up: function migration3up() {
    const sectionsBatch = Sections.rawCollection().initializeUnorderedBulkOp();
    let hasUpdates = false;
    const durationsMap = _.reduce(
      Durations,
      (result, value) => ( {...result, [value.slug]: value.value}),
      {}
    );
    Sections.find({}).forEach(section => {
      if (_.isString(section.duration)) {
        hasUpdates = true;
        sectionsBatch.find({_id: section._id}).updateOne({$set: {"duration": durationsMap[section.duration]}});
      }
    });

    if (hasUpdates) {
      // We need to wrap the async function to get a synchronous API that migrations expects
      const executeSectionsBatch = Meteor.wrapAsync(sectionsBatch.execute, sectionsBatch);
      return executeSectionsBatch();
    }

    return true;
  }
};