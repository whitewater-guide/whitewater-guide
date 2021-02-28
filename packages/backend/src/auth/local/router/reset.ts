import { compare, hash } from 'bcrypt';
import { Middleware } from 'koa';
import isUUID from 'validator/lib/isUUID';

import db from '~/db';
import { UserRaw } from '~/features/users';

import { SALT_ROUNDS } from '../../constants';
import { MailType, sendMail } from '../../mail';
import logger from '../logger';
import { isPasswordWeak } from '../utils';

const reset: Middleware<any, any> = async (ctx, next) => {
  const { id, token, password } = ctx.request.body;
  if (!id || !token || !password) {
    ctx.throw(400, 'reset.errors.form.missing_arguments', {
      payload: { id, token: !!token, password: !!password },
    });
    return;
  }
  if (!isUUID(id)) {
    ctx.throw(400, 'reset.errors.form.invalid_id', { payload: { id } });
    return;
  }
  if (isPasswordWeak(password)) {
    ctx.throw(400, 'reset.errors.password.weak', { payload: { id } });
    return;
  }

  const user: UserRaw | undefined = await db()
    .select('*')
    .from('users')
    .where({ id })
    .first();
  if (!user) {
    ctx.throw(400, 'reset.errors.form.invalid_id', { payload: { id } });
    return;
  }
  if (!user.password) {
    ctx.throw(400, 'reset.errors.form.not_local', { payload: { id } });
    return;
  }

  const resetToken = user.tokens.find((t) => t.claim === 'passwordReset');
  if (!resetToken) {
    ctx.throw(400, 'reset.errors.form.unexpected', { payload: { id } });
    return;
  }
  if (new Date().valueOf() > resetToken.expires) {
    ctx.throw(400, 'reset.errors.form.expired', { payload: { id } });
    return;
  }
  const tokenMatches = await compare(token, resetToken.value);
  if (!tokenMatches) {
    ctx.throw(400, 'reset.errors.form.token_mismatch', { payload: { id } });
    return;
  }

  const hashedPassword = await hash(password, SALT_ROUNDS);
  await db()
    .table('users')
    .update({
      password: hashedPassword,
      tokens: JSON.stringify(
        user.tokens.filter((t) => t.claim !== 'passwordReset'),
      ),
    })
    .where({ id });

  try {
    if (user.email) {
      await sendMail(MailType.RESET_SUCCESS, user.email, {
        user: { id: user.id, name: user.name || '' },
      });
    }
  } catch (err) {
    logger.warn({
      userId: id,
      error: err,
      message: 'reset.send.success.failed',
      extra: { email: user.email },
    });
  }

  ctx.status = 200;
  ctx.body = { success: true, id };
  await next();
};

export default reset;
