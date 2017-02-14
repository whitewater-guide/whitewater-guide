import {FilesCollection} from 'meteor/ostrio:files';
import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import AdminMethod from "../../utils/AdminMethod";

export const Images = new FilesCollection({
  collectionName: 'images',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 1MB, and only in png/jpg/jpeg formats
    if (file.size <= 1048576 && /png|jpg|jpeg/i.test(file.extension)) {
      if (Roles.userIsInRole(this.userId, 'admin')) {
        return true;
      }
      else {
        return 'Must be admin to upload photos';
      }
    } else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  },
  onBeforeRemove: function () {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return true;
    }
    else {
      return 'Must be admin to remove photos';
    }
  },
  public: true,
  ...Meteor.settings.public.imageUploads,
});

Images.collection.attachSchema(new SimpleSchema(Images.schema));

export const deleteImage = new AdminMethod({
  name: 'images.delete',

  validate: new SimpleSchema({
    imageId: {type: String}
  }).validator(),

  applyOptions: {
    noRetry: true,
  },

  run({imageId}) {
    Images.remove({_id: imageId});
  },

});
