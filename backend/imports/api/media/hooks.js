import path from 'path';
import fs from 'fs';
import {IMAGES_DIR} from '../../core/uploads';

export function registerHooks(Media) {
  Media.after.remove(function (userId, mediaDoc) {
    if (mediaDoc.type === 'uploaded_image'){
      const filepath = path.resolve(IMAGES_DIR, mediaDoc.url);
      fs.unlink(filepath, (err) => {
        if (err)
          console.error('Failed to delete file after media was deleted', filepath, err);
      });
    }
  });
}