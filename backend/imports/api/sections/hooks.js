import {Points} from '../points';
import {Media} from '../media';
import {Regions} from '../regions';
import {BoundingBox} from 'geocoordinate';

export function registerHooks(Sections) {
  Sections.after.remove(function (userId, sectionDoc) {
    Points.remove({_id: {$in: [sectionDoc.putIn._id, sectionDoc.takeOut._id, ...sectionDoc.poiIds]}});
    Media.remove({_id: {$in: sectionDoc.mediaIds}});
  });

  Sections.after.insert(function (userId, sectionDoc) {
    updateRegionBounds(sectionDoc);
  });

  Sections.after.update(function (userId, sectionDoc) {
    updateRegionBounds(sectionDoc);
  }, {fetchPrevious: false});

}

function updateRegionBounds({regionId, putIn, takeOut}) {
  const region = Regions.findOne(regionId, {fields: {bounds: 1}});
  if (!region)
    return;
  const bbox = new BoundingBox();
  if (region.bounds) {
    if (!region.bounds.autocompute)
      return;
    if (region.bounds.sw) {
      bbox.pushCoordinate(region.bounds.sw[1], region.bounds.sw[0]);
    }
    if (region.bounds.ne) {
      bbox.pushCoordinate(region.bounds.ne[1], region.bounds.ne[0]);
    }
  }
  bbox.pushCoordinate(putIn.coordinates[1], putIn.coordinates[0]);
  bbox.pushCoordinate(takeOut.coordinates[1], takeOut.coordinates[0]);
  const bounds = {
    sw: [bbox.longitude.min, bbox.latitude.min],
    ne: [bbox.longitude.max, bbox.latitude.max],
    autocompute: true,
  };
  Regions.update({_id: regionId}, {$set: {bounds}});
}
