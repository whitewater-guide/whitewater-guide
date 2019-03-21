import db from '@db';
import { UserRaw } from '@features/users';
import { Middleware } from 'koa';
import isUUID from 'validator/lib/isUUID';
import { MailType, sendMail } from '../../mail';
import logger from '../logger';
import { randomToken } from '../utils';

const verificationRequest: Middleware<any, any> = async (ctx, next) => {
  const id: string | undefined = ctx.request.body && ctx.request.body.id;
  if (!id) {
    ctx.throw(400, 'verification.request.id.missing');
    return;
  }
  if (!isUUID(id)) {
    ctx.throw(400, 'verification.request.id.incorrect', { payload: { id } });
    return;
  }
  const user: UserRaw | undefined = await db()
    .select('*')
    .from('users')
    .where({ id })
    .first();
  if (!user) {
    ctx.throw(400, 'verification.request.user.not.found', { payload: { id } });
    return;
  }
  if (user.verified) {
    ctx.throw(400, 'verification.request.unnecessary', { payload: { id } });
    return;
  }
  if (!user.email) {
    ctx.throw(400, 'verification.request.email.missing', { payload: { id } });
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
    ctx.throw(400, 'verification.request.send.failed', {
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
