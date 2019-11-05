import { getFacebookId } from './video';

describe('facebook', () => {
  it.each([
    ['https://www.facebook.com/watch/?v=123456', '123456'],
    ['https://www.facebook.com/user/videos/7890/', '7890'],
    [
      'https://www.facebook.com/user/videos/10210/?hc_ref=ARSNZkSWDw5Y&v=2',
      '10210',
    ],
  ])('%s should have id %s', (url, id) => {
    expect(getFacebookId(url)).toBe(id);
  });
});
