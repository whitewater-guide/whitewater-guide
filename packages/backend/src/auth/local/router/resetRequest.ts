import { Middleware } from 'koa';
import isEmail from 'validator/lib/isEmail';

import { db, Sql } from '~/db';
import { MailType, sendMail } from '~/mail';

import logger from '../logger';
import { randomToken } from '../utils';

const resetRequest: Middleware<any, any> = async (ctx, next) => {
  let { email } = ctx.request.body;
  if (!email || !isEmail(email)) {
    ctx.throw(400, 'forgot.errors.email.invalid', {
      payload: { email },
    });
    return;
  }
  email = email.toLowerCase();

  const user: Sql.Users | undefined = await db()
    .select('*')
    .from('users')
    .where({ email })
    .first();

  if (!user) {
    ctx.throw(400, 'forgot.errors.email.not_found', {
      payload: { email },
    });
    return;
  }

  if (!user.password) {
    ctx.throw(400, 'forgot.errors.form.not_local', {
      payload: { email },
    });
    return;
  }

  const token = await randomToken();
  const tokens = user.tokens
    .filter((t) => t.claim !== 'passwordReset')
    .concat({
      claim: 'passwordReset',
      expires: token.expires,
      value: token.encrypted,
    });
  await db()
    .table('users')
    .update({ tokens: JSON.stringify(tokens) })
    .where({ id: user.id });

  try {
    await sendMail(MailType.RESET_REQUEST, email, {
      user: {
        id: user.id,
        name: user.name || '',
      },
      token,
    });
  } catch {
    ctx.throw(400, 'forgot.errors.email.send_failed', {
      payload: { email },
    });
    return;
  }

  ctx.status = 200;
  ctx.body = { success: true };
  logger.info({ email }, 'password reset token sent');
  await next();
};

export default resetRequest;
