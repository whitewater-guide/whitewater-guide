import {Rivers} from '../index';
import {Sections} from '../../sections';
import _ from 'lodash';

Rivers.after.remove(function (userId, riverDoc) {
  Sections.remove({riverId: riverDoc._id});
});

Rivers.after.update(function (userId, riverDoc, fieldNames) {
  let updates = {};
  if (this.previous.regionId != riverDoc.regionId) {
    //When we change a region of a river, update/denormalize/ this region in all sections f a river
    updates = {...updates, regionId: riverDoc.regionId};
  }
  //Denormalize river name
  if (this.previous.name != riverDoc.name) {
    updates = {...updates, riverName: riverDoc.name};
  }
  //Denormalize i18n river name
  if (fieldNames.includes('i18n')){
    for (let lng in riverDoc.i18n){
      let prevName = _.get(this.previous, `i18n.${lng}.name`);
      let nextName = _.get(riverDoc, `i18n.${lng}.name`);
      if (nextName && nextName !== prevName){
        updates[`i18n.${lng}.name`] = nextName;
      }
    }
  }

  if (!_.isEmpty(updates))
    Sections.update({riverId: riverDoc._id}, {$set: updates}, {multi: true});
});