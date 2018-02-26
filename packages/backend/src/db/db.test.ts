import db from './db';

test('db sanity check', async () => {
  expect(db).toBeDefined();
  expect(db).toEqual(expect.any(Function));
});
