import { FileLike } from './types';

export const getDotExt = (file: FileLike) => {
  const parts = file.name.split('.');
  let ext = '';
  if (parts.length >= 2) {
    ext = parts.pop()!;
  }
  if (ext) {
    return `.${ext}`;
  } else {
    switch (file.type) {
      case 'image/jpeg':
        return '.jpg';
      case 'image/png':
        return '.png';
      default:
        return '';
    }
  }
};