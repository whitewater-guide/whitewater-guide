const Original = jest.requireActual('../imgproxy.ts');

const getImgproxyURL = (prefix: string, file: string, opts: any) => {
  return opts
    ? `imgproxy://${Original.stringifyProcessingOpts(opts)}/${prefix}/${file}`
    : `imgproxy://${prefix}/${file}`;
};

module.exports = {
  ...Original,
  Imgproxy: {
    ...Original.Imgproxy,
    decodeContentURL: (url: string): string => url.split('/').pop()!,
    url: getImgproxyURL,
  },
};
