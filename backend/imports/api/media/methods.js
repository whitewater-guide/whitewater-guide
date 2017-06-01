import {Media} from './collection';
import {Meteor} from 'meteor/meteor';
import sizeOf from 'image-size';
import {upsertChildren} from '../../utils/CollectionUtils';
import {IMAGES_DIR} from '../../core/uploads';
import fs from 'fs-extra';
import path from 'path';

function getName(file) {
  return file.filename + path.extname(file.originalname).toLowerCase();
}

export function upsertMedia(items, language) {
  //When media is deleted, hook will delete its file
  const newItems = items.map(({file, url, ...item}) => {
    let width;
    let height;
    if (item.type === 'photo' && file) {
      url = getName(file);
      const dimensions = sizeOf(file.path);
      width = dimensions.width;
      height = dimensions.height;
    }
    return {...item, url, width, height};
  });
  return upsertChildren(Media, newItems, language);
}

export function moveTempFiles(items) {
  items.forEach(({file}) => {
    if (file) {
      const filename = getName(file);
      const src = file.path;
      const dest = path.resolve(IMAGES_DIR, filename);
      fs.move(src, dest, Meteor.bindEnvironment((err) => {
        if (err)
          console.error('Failed to move temp file', src, dest, err);
      }));
    }
  });
}