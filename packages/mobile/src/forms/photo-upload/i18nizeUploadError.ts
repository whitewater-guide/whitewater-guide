import {
  MAX_FILE_SIZE_STRING,
  MIN_FILE_SIZE_STRING,
} from '@whitewater-guide/commons';

export default (e: Error & { code?: string }): any => {
  switch (e.code) {
    case 'EntityTooSmall':
      return {
        key: 'yup:file.tooSmall',
        options: { minSize: MIN_FILE_SIZE_STRING },
      };
    case 'EntityTooLarge':
      return {
        key: 'yup:file.tooLarge',
        options: { maxSize: MAX_FILE_SIZE_STRING },
      };
    default:
      return e.message;
  }
};
