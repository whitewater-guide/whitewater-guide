import {Meteor} from 'meteor/meteor';
import {Sections} from '../api/sections';
import {Media} from '../api/media';

/**
 * Migrate media:
 * Delete all garbage old unrecoverable photos
 * Rename 'uploaded_image' to 'photo'
 * {type: {$in: ['photo','uploaded_image']}, url: {$in: ['undefined', null, /^http:\/\/ww/]}}
 */
export default {
  version: 12,
  up: function migration12up() {
    const badMediaSelector = {$or: [{type: 'photo', url: {$not: /^https/}}, {type: 'uploaded_image', url: {$in: ['undefined', null, /^http:\/\/ww/]}}]};
    Media.remove(badMediaSelector);
    Media.update({type: 'uploaded_image'}, {$set: {type: 'photo'}}, {multi: true});
    return true;
  }
}