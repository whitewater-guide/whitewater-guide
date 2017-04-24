import {Regions} from '../api/regions';
import {Meteor} from 'meteor/meteor';

/**
 * Transform region bounds to be polygon rather than bounding box
 */
export default {
  version: 10,
  up: function migration10up() {
    const regionsBatch = Regions.rawCollection().initializeUnorderedBulkOp();
    let hasUpdates = false;
    Regions.find({bounds: {$exists: true}}).forEach(region => {
      hasUpdates = true;
      const { sw: [w, s], ne: [e, n] } = region.bounds;
      const bounds = [[w, n], [e, n], [e, s], [w, s]];
      regionsBatch.find({ _id: region._id }).updateOne({
        $set: { bounds },
      });
    });

    if (hasUpdates) {
      // We need to wrap the async function to get a synchronous API that migrations expects
      const executeRegionsBatch = Meteor.wrapAsync(regionsBatch.execute, regionsBatch);
      return executeRegionsBatch();
    }

    return true;
  }
}