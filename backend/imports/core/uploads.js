/**
 * Based on https://github.com/HriBB/graphql-server-express-upload
 * Modified to support deep variables
 */

import RecursiveIterator from 'recursive-iterator';
import {compose} from 'compose-middleware';
import multer from 'multer';
import multerAutoreap from 'multer-autoreap';
import _ from 'lodash';
import path from 'path';

function isUpload(req) {
  return Boolean(
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


export const TEMP_DIR = process.env['METEOR_SHELL_DIR'] + '/../../../public/temp';
export const IMAGES_DIR = process.env['METEOR_SHELL_DIR'] + '/../../../public/images';

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
});

/**
 * Set up multer middleware for file uploads
 * Includes autoreap for temp file removal
 */
export function multerUploads() {
  return compose([
    upload.any(),
    multerAutoreap,
  ]);
}