import LIST_SOURCES from './listSources.query';

test('should be correct query', () => {
  expect(LIST_SOURCES).toMatchSnapshot();
});
