import { Sql } from '~/db';

import logger from './logger';
import { sendMail } from './sendMail';
import { MailType } from './types';

export async function sendWelcome(user: Sql.Users) {
  if (!user.email) {
    return;
  }
  try {
    await sendMail(MailType.WELCOME_VERIFIED, user.email, {
      user: { id: user.id, name: user.name || '' },
    });
  } catch (e) {
    logger.error({
      extra: {
        email: user.email,
        error: (e as Error).message,
      },
      tags: {
        code: 'signup.send.verification.error',
      },
    });
  }
}
