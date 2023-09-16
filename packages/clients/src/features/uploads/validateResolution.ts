export function validateResolution(
  [width, height]: [number, number],
  required?: number | [number, number],
): { key: string; options?: any } | undefined {
  if (!required) {
    return undefined;
  }
  if (typeof required === 'number') {
    const mpx = width * height;
    if (mpx > required * 1000 * 1000) {
      return {
        key: 'yup:photo.megapixels',
        options: { mpx: required },
      };
    }
  } else {
    const [reqW, reqH] = required;
    if (reqW !== width || reqH !== height) {
      return {
        key: 'yup:photo.resolution',
        options: { width: reqW, height: reqH },
      };
    }
  }
  return undefined;
}
