import GAUGE_DETAILS from './gaugeDetails.query';

test('should match snapshot', () => {
  expect(GAUGE_DETAILS).toMatchSnapshot();
});
