import { getDotExt } from './getDotExt';

describe('getDotExt', () => {
  it.each([
    ['no extension and no mime', 'filename', '', ''],
    ['no extension and mime', 'filename', 'image/jpeg', '.jpg'],
    ['extension and mime', 'filename.png', 'image/jpeg', '.png'],
    ['extension and no mime', 'filename.png', '', '.png'],
    ['multiple dots and no mime', 'file.name.jpg', '', '.jpg'],
    ['multiple dots and mime', 'file.name.jpg', 'image/png', '.jpg'],
  ])('should get correct extentsion for %s', (_, name, type, ext) => {
    expect(getDotExt({ name, type })).toBe(ext);
  });
});
