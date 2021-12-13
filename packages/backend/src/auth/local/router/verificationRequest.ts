import { Middleware } from 'koa';
import isUUID from 'validator/lib/isUUID';

import { db, Sql } from '~/db';
import { MailType, sendMail } from '~/mail';

import logger from '../logger';
import { randomToken } from '../utils';

const verificationRequest: Middleware<any, any> = async (ctx, next) => {
  const id: string | undefined = ctx.request.body?.id;
  if (!id) {
    ctx.throw(400, 'verification_request.errors.form.id_missing');
    return;
  }
  if (!isUUID(id)) {
    ctx.throw(400, 'verification_request.errors.form.id_invalid', {
      payload: { id },
    });
    return;
  }
  const user: Sql.Users | undefined = await db()
    .select('*')
    .from('users')
    .where({ id })
    .first();
  if (!user) {
    ctx.throw(400, 'verification_request.errors.form.user_not_found', {
      payload: { id },
    });
    return;
  }
  if (user.verified) {
    ctx.throw(400, 'verification_request.errors.form.already_verified', {
      payload: { id },
    });
    return;
  }
  if (!user.email) {
    ctx.throw(400, 'verification_request.errors.form.not_local', {
      payload: { id },
    });
    return;
  }

  const token = await randomToken();
  const tokens = user.tokens
    .filter((t) => t.claim !== 'verification')
    .concat({
      claim: 'verification',
      expires: token.expires,
      value: token.encrypted,
    });
  await db()
    .table('users')
    .update({ tokens: JSON.stringify(tokens) })
    .where({ id: user.id });

  try {
    await sendMail(MailType.VERIFICATION_REQUEST, user.email, {
      user: { id: user.id, name: user.name || '' },
      token,
    });
  } catch {
    ctx.throw(400, 'verification_request.errors.form.send_failed', {
      payload: { email: user.email, id },
    });
    return;
  }
  ctx.status = 200;
  ctx.body = { success: true };
  logger.info({ email: user.email }, 'verification email sent');
  await next();
};

export default verificationRequest;
