import express from 'express';
import { WebApp } from 'meteor/webapp';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { IMAGES_DIR } from './uploads';

export const THUMBS_URL_BASE = '/thumbs';

const thumbsRouter = express.Router();

thumbsRouter.get(
  '/:size/:image',
  (req, res) => {
    if (!/^(\w+)\.(jpg|jpeg|png|gif|webp)$/.test(req.params.image)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Bad image name' }));
      return;
    }
    const file = path.resolve(IMAGES_DIR, req.params.image);
    if (!fs.existsSync(file)){
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Source image not found' }));
      return;
    }
    const size = parseInt(req.params.size);
    if (isNaN(size) || size < 10 || size > 1024) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Invalid image size' }));
      return;
    }
    const transformer = sharp()
      .resize(size, size)
      .crop(sharp.strategy.attention);
    res.setHeader('Cache-Control', 'max-age=2592000');
    fs.createReadStream(file).pipe(transformer).pipe(res);
  }
);

WebApp.connectHandlers.use(THUMBS_URL_BASE, thumbsRouter);