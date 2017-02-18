import {Media} from './collection';
import {Meteor} from 'meteor/meteor';
import {upsertChildren} from '../../utils/CollectionUtils';
import {IMAGES_DIR} from '../../core/uploads';
import mv from 'mv';
import path from 'path';

export function upsertMedia(items, language) {
  //TODO: deleted files
  const newItems = items.map(({file, url, ...item}) => {
    if (item.type === 'uploaded_image' && file)
      url = file.filename + path.extname(file.originalname).toLowerCase();
    return {...item, url};
  });
  return upsertChildren(Media, newItems, language);
}

export function moveTempFiles(items) {
  items.forEach(({file}) => {
    if (file) {
      const filename = file.filename + path.extname(file.originalname).toLowerCase();
      const src = file.path;
      const dest = path.resolve(IMAGES_DIR, filename);
      mv(src, dest, Meteor.bindEnvironment((err) => {
        console.log('Moved file', src, dest, err);
      }));
    }
  });
}