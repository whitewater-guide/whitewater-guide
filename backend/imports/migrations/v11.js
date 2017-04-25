import {Sections} from '../api/sections';
import {Points} from '../api/points';
import {Gauges} from '../api/gauges';
import {Meteor} from 'meteor/meteor';
import set from 'lodash/fp/set';

/**
 * Delete denormalized putIn adn takeOut from sections (use shape)
 * Transform points: remove altitude and stuff it into third coordinate
 * Transform shapes of sections - add putIn and takeOut altitude if present
 * Transform gauges - denormalize locations again, to get rid of altitude
 */
export default {
  version: 11,
  up: function migration11up() {
    const sectionsBatch = Sections.rawCollection().initializeUnorderedBulkOp();
    let hasSectionUpdates = false;
    //Find sections, delete putIn and takeOut
    //If they have altitudes, put those altitudes as third coordinate in shape
    Sections.find({putIn: {$exists: true}}).forEach(section => {
      hasSectionUpdates = true;
      const putInAlt = section.putIn.altitude;
      let shape = section.shape;
      const takeOutAlt = section.takeOut.altitude;
      const last = section.shape.length - 1;
      if (putInAlt) {
        shape = set('0.2', putInAlt, shape);
      }
      if (takeOutAlt) {
        shape = set(`${last}.2`, takeOutAlt, shape);
      }
      sectionsBatch.find({_id: section._id}).updateOne({
        $set: {shape},
        $unset: {putIn: 1, takeOut: 1},
      });
    });

    if (hasSectionUpdates) {
      // We need to wrap the async function to get a synchronous API that migrations expects
      const executeSectionsBatch = Meteor.wrapAsync(sectionsBatch.execute, sectionsBatch);
      executeSectionsBatch();
    }

    // Now update points

    const pointsBatch = Points.rawCollection().initializeUnorderedBulkOp();
    let hasPointsUpdates = false;
    Points.find({altitude: {$exists: true}}).forEach(point => {
      if (point.altitude){
        hasPointsUpdates = true;
        pointsBatch.find({_id: point._id}).updateOne({
          $set: {'coordinates.2': point.altitude},
          $unset: {altitude: 1},
        });
      }
    });

    if (hasPointsUpdates) {
      // We need to wrap the async function to get a synchronous API that migrations expects
      const executePointsBatch = Meteor.wrapAsync(pointsBatch.execute, pointsBatch);
      executePointsBatch();
    }

    // Now update gauges

    const gaugesBatch = Gauges.rawCollection().initializeUnorderedBulkOp();
    let hasGaugesUpdates = false;
    //Find sections, delete putIn and takeOut
    //If they have altitudes, put those altitudes as third coordinate in shape
    Gauges.find({location: {$exists: true}}).forEach(gauge => {
      if (gauge.location) {
        hasGaugesUpdates = true;
        const location = Points.findOne({ _id: gauge.location._id });
        gaugesBatch.find({ _id: gauge._id }).updateOne({
          $set: { location },
        });
      }
    });

    if (hasGaugesUpdates) {
      // We need to wrap the async function to get a synchronous API that migrations expects
      const executeGaugesBatch = Meteor.wrapAsync(gaugesBatch.execute, gaugesBatch);
      executeGaugesBatch();
    }

    return true;
  }
}