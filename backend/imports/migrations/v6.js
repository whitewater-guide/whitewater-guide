import {Regions} from '../api/regions';
import {Sections} from '../api/sections';
import {BoundingBox} from 'geocoordinate';
import {Meteor} from 'meteor/meteor';
import _ from 'lodash';

/**
 * Adds bounding boxes to regions
 */
export default {
  version: 6,
  up: function migration6up() {
    const regionsBatch = Regions.rawCollection().initializeUnorderedBulkOp();
    let boxes = {};
    Sections.find({}).forEach(section => {
      let bbox = boxes[section.regionId] || new BoundingBox();
      bbox.pushCoordinate(section.putIn.coordinates[1], section.putIn.coordinates[0]);
      bbox.pushCoordinate(section.takeOut.coordinates[1], section.takeOut.coordinates[0]);
      boxes[section.regionId] = bbox;
    });
    if (!_.isEmpty(boxes)) {
      _.forEach(boxes, (bbox, regionId) => {
        let bounds = {
          sw: [bbox.longitude.min, bbox.latitude.min],
          ne: [bbox.longitude.max, bbox.latitude.max],
          autocompute: true,
        };
        regionsBatch.find({_id: regionId}).update({$set: {bounds}})
      });
      const executeRegionsBatch = Meteor.wrapAsync(regionsBatch.execute, regionsBatch);
      return executeRegionsBatch();
    }

    return true;
  }
}