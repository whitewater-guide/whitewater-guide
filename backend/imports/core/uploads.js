import formidable from 'formidable';
import {WebApp} from 'meteor/webapp';
import {Meteor} from 'meteor/meteor';
import path from 'path';
import fs from 'fs';

const UPLOADS_DIR = process.env['METEOR_SHELL_DIR'] + '/../../../public/images';
console.log('PWD', process.cwd());
console.log('UPLOADS', path.resolve(UPLOADS_DIR));

//See https://github.com/VeliovGroup/Meteor-Files/issues/286
WebApp.connectHandlers.use("/upload", function (req, res, next) {

  console.log('User', this.userId);

  const form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = path.resolve(UPLOADS_DIR);
  form.maxFieldsSize = 1024 * 1024;//1 MB

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    console.log('File uploaded', field, file.path, file.name);
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    console.log('All files uploaded');
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});