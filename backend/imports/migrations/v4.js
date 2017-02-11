import {Regions} from '../api/regions';
import {Meteor} from "meteor/meteor";

/**
 * Adds POIs to regions
 */
export default {
  version: 4,
  up: function migration4up() {
    const regionsBatch = Regions.rawCollection().initializeUnorderedBulkOp();
    let hasUpdates = false;
    Regions.find({poiIds: {$exists: false}}).forEach(region => {
      hasUpdates = true;
      regionsBatch.find({_id: region._id}).updateOne({$set: {"poiIds": []}});
    });

    if (hasUpdates) {
      // We need to wrap the async function to get a synchronous API that migrations expects
      const executeRegionsBatch = Meteor.wrapAsync(regionsBatch.execute, regionsBatch);
      return executeRegionsBatch();
    }

    return true;
  }
};