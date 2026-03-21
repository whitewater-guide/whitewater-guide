import getPathTokens from './getPathTokens';

it('should get path tokens', () => {
  expect(getPathTokens('/regions/:regionId/sections/:sectionId')).toEqual([
    '/regions',
    '/regions/:regionId',
    '/regions/:regionId/sections',
    '/regions/:regionId/sections/:sectionId',
  ]);
});
