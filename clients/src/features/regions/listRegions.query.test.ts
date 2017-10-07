import LIST_REGIONS from './listRegions.query';

test('should be correct query', () => {
  expect(LIST_REGIONS).toMatchSnapshot();
});
