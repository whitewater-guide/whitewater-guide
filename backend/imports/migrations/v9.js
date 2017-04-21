import {Sections} from '../api/sections';
import {Meteor} from 'meteor/meteor';

/**
 * Add shape to existing sections
 */
export default {
  version: 9,
  up: function migration9up() {
    const sectionsBatch = Sections.rawCollection().initializeUnorderedBulkOp();
    let hasUpdates = false;
    Sections.find({shape: {$exists: false}}).forEach(section => {
      hasUpdates = true;
      const shape = [section.putIn.coordinates, section.takeOut.coordinates];
      sectionsBatch.find({_id: section._id}).updateOne({
        $set: {shape},
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