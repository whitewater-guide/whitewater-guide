/**
 * Based on https://github.com/HriBB/graphql-server-express-upload
 * Modified to support deep variables
 */

import RecursiveIterator from 'recursive-iterator';
import {Meteor} from 'meteor/meteor';
import {compose} from 'compose-middleware';
import multer from 'multer';
import multerAutoreap from 'multer-autoreap';
import _ from 'lodash';
import path from 'path';

function isUpload(req) {
  return Boolean(
    req.url === '/graphql' &&
    req.method === 'POST' &&
    req.is('multipart/form-data')
  );
}

export function graphqlServerExpressUpload() {
  return function (req, res, next) {
    if (!isUpload(req)) {
      return next();
    }
    const files = _.keyBy(req.files, 'fieldname');
    const body = req.body;
    const variables = JSON.parse(body.variables);

    for (let {node, parent, key} of new RecursiveIterator(variables)) {
      if (key === 'file' && _.isString(node)) {
        parent[key] = files[node]
      }
    }

    req.body = {
      operationName: body.operationName,
      query: body.query,
      variables: variables
    };
    return next();
  }
}

const UPLOADS_DIR = Meteor.isDevelopment ? process.env['METEOR_SHELL_DIR'] + '/../../../public': '/uploads';
export const TEMP_DIR   = UPLOADS_DIR + '/temp';
export const IMAGES_DIR = UPLOADS_DIR + '/images';

const upload = multer({
  dest: TEMP_DIR,
  fileFilter(req, file, cb) {

    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: File upload only supports the following filetypes - " + filetypes);
  }
}).any();

const uploadHandler = function(req, res, next){
  if (!isUpload(req))
    return next();

  upload(req, res, function(err){
    if (err)
      return next(err);
    return next();
  });
};

/**
 * Set up multer middleware for file uploads
 * Includes autoreap for temp file removal
 */
export function multerUploads() {
  return compose([
    uploadHandler,
    multerAutoreap,
  ]);
}