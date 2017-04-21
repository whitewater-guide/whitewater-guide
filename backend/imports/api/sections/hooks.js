import {Points} from '../points';
import {Media} from '../media';

export function registerHooks(Sections) {
  Sections.after.remove(function (userId, sectionDoc) {
    Points.remove({_id: {$in: [...sectionDoc.poiIds]}});
    Media.remove({_id: {$in: sectionDoc.mediaIds}});
  });

}
