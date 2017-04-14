import {Sections} from '../api/sections';
import {Points} from '../api/points';
import {Meteor} from 'meteor/meteor';

/**
 * Some sections don't have kind in putIn and takeOut objects
 */
export default {
  version: 8,
  up: function migration8up() {
    const sectionsBatch = Sections.rawCollection().initializeUnorderedBulkOp();
    let hasUpdates = false;
    Sections.find({"putIn.kind": {$exists: false}}).forEach(section => {
      hasUpdates = true;
      const putIn = Points.findOne({_id: section.putIn._id});
      const takeOut = Points.findOne({_id: section.takeOut._id});
      sectionsBatch.find({_id: section._id}).updateOne({
        $set: {putIn, takeOut},
      });
    });

    if (hasUpdates) {
      // We need to wrap the async function to get a synchronous API that migrations expects
      const executeSectionsBatch = Meteor.wrapAsync(sectionsBatch.execute, sectionsBatch);
      return executeSectionsBatch();
    }

    return true;
  }
}