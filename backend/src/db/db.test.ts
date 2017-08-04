import db from './db';

test('db sanity check', async () => {
  console.log('Db sanity check');
  expect(db).toBeDefined();
  expect(db).toEqual(expect.any(Function));
});
