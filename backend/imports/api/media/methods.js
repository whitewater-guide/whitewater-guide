import {Media} from './collection';
import {Meteor} from 'meteor/meteor';
import {upsertChildren} from '../../utils/CollectionUtils';
import {IMAGES_DIR} from '../../core/uploads';
import fs from 'fs-extra';
import path from 'path';

export function upsertMedia(items, language) {
  //When media is deleted, hook will delete its file
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
      fs.move(src, dest, Meteor.bindEnvironment((err) => {
        if (err)
          console.error('Failed to move temp file', src, dest, err);
      }));
    }
  });
}