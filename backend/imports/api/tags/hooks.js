import { Sections } from '../sections';

export function registerRemovalHooks(TagsCollection, fieldName) {
  TagsCollection.after.remove(function (userId, tagDoc) {
    console.log('removed tag', tagDoc);
    Sections.update({}, { $pull: { [fieldName]: tagDoc._id } }, { multi: true });
  });
}