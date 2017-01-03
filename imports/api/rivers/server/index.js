import { Rivers } from '../index';
import { Sections } from '../../sections';

Rivers.after.remove(function (userId, riverDoc) {
  Sections.remove({ riverId: riverDoc._id });
});

Rivers.after.update(function (userId, riverDoc) {
  //When we change a region of a river, update/denormalize/ this region in all sections f a river
  if (this.previous.regionId != riverDoc.regionId){
    Sections.update({riverId: riverDoc._id}, {regionId: riverDoc.regionId}, {multi: true});
  }
});