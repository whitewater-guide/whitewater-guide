import REGION_DETAILS from './regionDetails.query';

test('should be correct query', () => {
  expect(REGION_DETAILS).toMatchSnapshot();
});
