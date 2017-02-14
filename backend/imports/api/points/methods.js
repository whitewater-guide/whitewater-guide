import {Points} from './collection';

export function upsertPoint({_id, ...updates}, language) {
  const {insertedId} = Points.upsertTranslations(_id, {[language]: updates});
  return {_id: insertedId || _id, ...updates};
}