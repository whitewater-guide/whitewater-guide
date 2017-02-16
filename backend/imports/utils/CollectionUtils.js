import _ from 'lodash';

export function upsertChildren(Collection, children, language) {
  let result = children.map(({_id, deleted, ...item}) => {
    if (deleted) {
      Collection.remove({_id});
      return null;
    }
    const {insertedId} = Collection.upsertTranslations(_id, {[language]: item});
    return _id || insertedId;
  });
  return _.compact(result);
}