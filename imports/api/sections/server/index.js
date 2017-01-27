import {Sections} from '../index';
import {Media} from '../../media';
import {Points} from '../../points';

Sections.after.remove(function (userId, sectionDoc) {
  Points.remove({_id: {$in: [sectionDoc.putIn._id, sectionDoc.takeOut._id, ...sectionDoc.poiIds]}});
  Media.remove({_id: {$in: sectionDoc.mediaIds}});
});