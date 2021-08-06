import { compare } from 'bcrypt';
import { Middleware } from 'koa';

import config from '~/config';
import { db, Sql } from '~/db';

const VERIFIED_URL = `${config.PROTOCOL}://${config.ROOT_DOMAIN}/verified.html`;

const verification: Middleware<any, any> = async (ctx) => {
  const { id, token } = ctx.request.query;
  if (!token) {
    ctx.throw(400, 'verification.token.missing', { payload: { id } });
    return;
  }
  if (!id) {
    ctx.throw(400, 'verification.id.missing');
    return;
  }

  const user: Sql.Users | undefined = await db()
    .select('*')
    .from('users')
    .where({ id })
    .first();
  if (!user) {
    ctx.throw(400, 'verification.token.invalid', { payload: { id } });
    return;
  }
  const redirectURL = `${VERIFIED_URL}?name=${encodeURIComponent(user.name)}`;
  if (user.verified) {
    ctx.redirect(redirectURL);
    return;
  }
  const verificationToken = user.tokens.find((t) => t.claim === 'verification');
  if (!verificationToken) {
    ctx.throw(400, 'verification.unexpected', { payload: { id } });
    return;
  }
  if (new Date().valueOf() > verificationToken.expires) {
    ctx.throw(400, 'verification.expired', { payload: { id } });
    return;
  }
  const tokenMatches = await compare(token, verificationToken.value);
  if (!tokenMatches) {
    ctx.throw(400, 'verification.token.mismatch', { payload: { id } });
    return;
  }

  await db()
    .table('users')
    .update({
      verified: true,
      tokens: JSON.stringify(
        user.tokens.filter((t) => t.claim !== 'verification'),
      ),
    })
    .where({ id });

  ctx.redirect(redirectURL);
};

export default verification;
