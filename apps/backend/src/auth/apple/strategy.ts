import { SocialMediaProvider } from '@whitewater-guide/schema';
import { verifyIdToken } from 'apple-signin-auth';
import { Strategy } from 'passport-custom';

import { sendWelcome } from '../../mail/index';
import { storeUser } from '../social/index';
import { negotiateLanguage } from '../utils/index';
import type { AppleSignInPayload } from './types';

// eslint-disable-next-line @typescript-eslint/no-misused-promises
export const apppleStrategy = new Strategy(async (req, done) => {
  try {
    const { body } = req;
    const { identityToken, fullName } = body as AppleSignInPayload;
    if (!identityToken) {
      throw new Error('identity token not found');
    }
    const token = await verifyIdToken(identityToken, {
      audience: 'guide.whitewater',
      ignoreExpiration: true,
    });
    const language = negotiateLanguage(req);

    const username = fullName
      ? [fullName.givenName, fullName.familyName].filter((i) => !!i).join(' ')
      : 'Unknown User';
    const { isNew, user } = await storeUser(
      SocialMediaProvider.APPLE,
      {
        id: token.sub,
        email: token.email ?? null,
        username,
        displayName: username,
      },
      language,
    );
    if (user && isNew) {
      await sendWelcome(user);
    }
    // third argument is missing from typedefs
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    done(null, user, { isNew });
  } catch (err) {
    done(err, null);
  }
});
