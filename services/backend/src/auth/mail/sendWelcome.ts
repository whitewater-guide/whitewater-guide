import { UserRaw } from '~/features/users';
import authLogger from '../logger';
import { sendMail } from './sendMail';
import { MailType } from './types';

export async function sendWelcome(user: UserRaw) {
  if (!user.email) {
    return;
  }
  try {
    await sendMail(MailType.WELCOME_VERIFIED, user.email, {
      user: { id: user.id, name: user.name || '' },
    });
  } catch (e) {
    authLogger.error({
      extra: {
        email: user.email,
        error: e.message,
      },
      tags: {
        code: 'signup.send.verification.error',
      },
    });
  }
}
