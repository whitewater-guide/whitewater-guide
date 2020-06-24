import db from '~/db';

it('db sanity check', async () => {
  expect(db).toBeDefined();
  expect(db).toEqual(expect.any(Function));
});
