import { holdTransaction, rollbackTransaction } from '@db';
import { PHOTO_1 } from '@seeds/11_media';
import { UUID_REGEX } from '@test';
import { MediaConnector } from './connector';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe(('checkMediaId'), () => {
  const connector = new MediaConnector(undefined, 'en', new Map());

  it('should find existing', async () => {
    const result = await connector.checkMediaId(PHOTO_1);
    expect(result).toEqual({ found: true, id: PHOTO_1 });
  });

  it('should not find non-existing', async () => {
    const badId = 'fb2d84e0-1f95-11e8-b467-0ed5f89f718b';
    const result = await connector.checkMediaId(badId);
    expect(result.id).not.toBe(badId);
    expect(result).toEqual({ found: false, id: expect.stringMatching(UUID_REGEX) });
  });

  it('should generate id for null', async () => {
    const result = await connector.checkMediaId(null);
    expect(result).toEqual({ found: false, id: expect.stringMatching(UUID_REGEX) });
  });

  it('should generate id for undefined', async () => {
    const result = await connector.checkMediaId();
    expect(result).toEqual({ found: false, id: expect.stringMatching(UUID_REGEX) });
  });
});
