import {Sections} from '../api/sections';
import {Points} from '../api/points';
import {Meteor} from "meteor/meteor";

/**
 * Put-ins and take-outs must be denormalized
 */
export default {
  version: 5,
  up: function migration5up() {
    const sectionsBatch = Sections.rawCollection().initializeUnorderedBulkOp();
    let hasUpdates = false;
    Sections.find({putInId: {$exists: true}}).forEach(section => {
      hasUpdates = true;
      const putIn = Points.findOne({_id: section.putInId});
      const takeOut = Points.findOne({_id: section.takeOutId});
      sectionsBatch.find({_id: section._id}).updateOne({
        $set: {putIn, takeOut},
        $unset: {'putInId': '', 'takeOutId': ''}
      });
    });

    if (hasUpdates) {
      // We need to wrap the async function to get a synchronous API that migrations expects
      const executeSectionsBatch = Meteor.wrapAsync(sectionsBatch.execute, sectionsBatch);
      return executeSectionsBatch();
    }

    return true;
  }
};