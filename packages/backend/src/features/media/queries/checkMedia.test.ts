import { holdTransaction, rollbackTransaction } from '@db';
import { PHOTO_1 } from '@seeds/11_media';
import { UUID_REGEX } from '@test';
import { checkMediaId } from './checkMediaId';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

it('should find existing', async () => {
  const result = await checkMediaId(PHOTO_1);
  expect(result).toEqual({ found: true, id: PHOTO_1 });
});

it('should not find non-existing', async () => {
  const badId = 'fb2d84e0-1f95-11e8-b467-0ed5f89f718b';
  const result = await checkMediaId(badId);
  expect(result.id).not.toBe(badId);
  expect(result).toEqual({ found: false, id: expect.stringMatching(UUID_REGEX) });
});

it('should generate id for null', async () => {
  const result = await checkMediaId(null);
  expect(result).toEqual({ found: false, id: expect.stringMatching(UUID_REGEX) });
});

it('should generate id for undefined', async () => {
  const result = await checkMediaId();
  expect(result).toEqual({ found: false, id: expect.stringMatching(UUID_REGEX) });
});
