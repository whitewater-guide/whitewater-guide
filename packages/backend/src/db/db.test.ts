import { db } from '../db/index';

it('db sanity check', async () => {
  expect(db).toBeDefined();
  expect(db).toEqual(expect.any(Function));
});
