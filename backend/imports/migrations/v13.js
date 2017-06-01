import {Meteor} from 'meteor/meteor';
import path from 'path';
import fs from 'fs';
import sizeOf from 'image-size';
import {Media} from '../api/media';
import { IMAGES_DIR } from '../core/uploads';

/**
 * Update media - set dimensions for uploaded photos
 */
export default {
  version: 13,
  up: function migration13up() {
    const mediaBatch = Media.rawCollection().initializeUnorderedBulkOp();
    let hasUpdates = false;
    Media.find({type: 'photo', width: {$exists: false}}).forEach(media => {
      const file = path.resolve(IMAGES_DIR, media.url);
      if (fs.existsSync(file)) {
        hasUpdates = true;
        const { width, height } = sizeOf(file);
        mediaBatch.find({_id: media._id}).updateOne({ $set: { width, height } });
      }
    });

    if (hasUpdates) {
      // We need to wrap the async function to get a synchronous API that migrations expects
      const executeBatch = Meteor.wrapAsync(mediaBatch.execute, mediaBatch);
      return executeBatch();
    }
    return true;
  }
}