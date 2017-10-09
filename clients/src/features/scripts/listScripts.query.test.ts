import LIST_SCRIPTS from './listScripts.query';

test('should be correct query', () => {
  expect(LIST_SCRIPTS).toMatchSnapshot();
});
