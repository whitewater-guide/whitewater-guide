import superagent from 'superagent';

const LOCAL = `${process.env.PROTOCOL}://${process.env.APP_DOMAIN}`;

it('should expose schema.json', async () => {
  const resp = await superagent.get(`${LOCAL}/graphql/schema.json`);
  expect(resp.status).toBe(200);
  expect(() => JSON.parse(resp.text)).not.toThrow();
  expect(resp.text).toEqual(expect.stringContaining('Query'));
});

it('should expose typedefs.txt', async () => {
  const resp = await superagent.get(`${LOCAL}/graphql/typedefs.txt`);
  expect(resp.status).toBe(200);
  expect(resp.text).toEqual(expect.stringContaining('type Query'));
});
