export function upsertChildren(Collection, children, language) {
  return _.chain(children)
    .map(({_id, deleted, ...item}) => {
      if (deleted) {
        Collection.remove({_id});
        return null;
      }
      const {insertedId} = Collection.upsertTranslations(_id, {[language]: item});
      return _id || insertedId;
    })
    .compact()
    .value();
}