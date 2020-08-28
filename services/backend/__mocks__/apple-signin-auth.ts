import { AppleIdTokenType } from 'apple-signin-auth';

export async function verifyIdToken(
  token: string,
): Promise<Partial<AppleIdTokenType>> {
  switch (token) {
    case '__apple_token_admin__':
      return Promise.resolve({
        sub: '__apple_admin_id__',
        email: 'kaospostage@gmail.com',
      });
    case '__apple_token_w_email__':
      return Promise.resolve({
        sub: '__apple_id_w_email__',
        email: 'email@apple.com',
      });
    case '__apple_token_wo_email__':
      return Promise.resolve({
        sub: '__apple_id_wo_email__',
      });
    default:
      return Promise.reject(new Error('inavlid token'));
  }
}
