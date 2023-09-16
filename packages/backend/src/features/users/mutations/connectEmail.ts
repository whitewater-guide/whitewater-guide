import { compare, hash } from '@node-rs/bcrypt';

import type { AuthenticatedMutation } from '../../../apollo/index';
import {
  ForbiddenError,
  isAuthenticatedResolver,
  UserInputError,
} from '../../../apollo/index';
import { isPasswordWeak, SALT_ROUNDS } from '../../../auth/index';
import type { Sql } from '../../../db/index';
import { db } from '../../../db/index';
import log from '../../../log/index';
import { MailType, sendMail } from '../../../mail/index';
import { isEmail } from '../../../utils/index';

const connectEmail: AuthenticatedMutation['connectEmail'] = async (
  _,
  { email, password, token },
  context,
) => {
  const user: Sql.Users | undefined = await db()
    .select('*')
    .from('users')
    .where({ id: context.user.id })
    .first();

  if (!user || user.password) {
    throw new ForbiddenError('must not have password already set');
  }

  if (isPasswordWeak(password)) {
    throw new UserInputError('invalid input', {
      validationErrors: {
        connectEmail: { password: 'yup:string.weak_password' },
      },
    });
  }

  if (!isEmail(email)) {
    throw new UserInputError('invalid input', {
      validationErrors: { connectEmail: { email: 'yup:string.email' } },
    });
  }

  const connectToken = user.tokens.find((t) => t.claim === 'connectEmail');
  if (!connectToken) {
    throw new ForbiddenError('you have not requested this operation');
  }

  if (new Date().valueOf() > connectToken.expires) {
    throw new UserInputError('invalid input', {
      validationErrors: {
        connectEmail: { token: 'yup:string.tokenExpired' },
      },
    });
  }

  const tokenMatches = await compare(email + token, connectToken.value);
  if (!tokenMatches) {
    throw new UserInputError('invalid input', {
      validationErrors: {
        connectEmail: { token: 'yup:string.tokenInvalid' },
      },
    });
  }

  const byEmail: Sql.Users | undefined = await db()
    .select('id')
    .from('users')
    .where({ email })
    .first();

  if (byEmail && byEmail.id !== context.user.id) {
    throw new UserInputError('invalid input', {
      validationErrors: { connectEmail: { email: 'yup:string.emailTaken' } },
    });
  }

  const hashedPassword = await hash(password, SALT_ROUNDS);
  await db()
    .table('users')
    .update({
      email,
      password: hashedPassword,
      tokens: JSON.stringify(
        user.tokens.filter((t) => t.claim !== 'connectEmail'),
      ),
    })
    .where({ id: context.user.id });

  try {
    await sendMail(MailType.CONNECT_EMAIL_SUCCESS, email, {
      user: { id: user.id, name: user.name || '' },
    });
  } catch (err) {
    log.warn({
      userId: context.user.id,
      error: err as Error,
      message: 'connectemail.send.failed',
      extra: { email: user.email },
    });
  }
  return context.dataSources.users.getById(context.user.id);
};

export default isAuthenticatedResolver(connectEmail);
