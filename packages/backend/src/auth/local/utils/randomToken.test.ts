import { compare } from '@node-rs/bcrypt';

import type { RandomToken } from './randomToken';
import { randomToken } from './randomToken';

it('should generate random token', async () => {
  const token = await randomToken();
  expect(token).toEqual({
    raw: expect.stringMatching(/[0-9a-f]*/),
    encrypted: expect.any(String),
    expires: expect.any(Number),
  });
});

it('should be verify', async () => {
  const { raw, encrypted }: RandomToken = await randomToken();
  await expect(compare(raw, encrypted)).resolves.toBe(true);
});
