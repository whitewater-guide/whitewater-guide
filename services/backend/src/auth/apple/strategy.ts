import { SocialMediaProvider } from '@whitewater-guide/commons';
import { verifyIdToken } from 'apple-signin-auth';
import { Strategy } from 'passport-custom';
import { sendWelcome } from '../mail';
import { negotiateLanguage, storeUser } from '../social';
import { AppleSignInPayload } from './types';

export const apppleStrategy = new Strategy(async (req, done) => {
  try {
    const { body } = req;
    const { identityToken, fullName } = body as AppleSignInPayload;
    const token = await verifyIdToken(identityToken!, {
      audience: 'guide.whitewater',
      ignoreExpiration: true,
    });
    // tslint:disable-next-line: no-console
    const language = negotiateLanguage(req, ['en']);

    const username = fullName
      ? [fullName.familyName, fullName.givenName].filter((i) => !!i).join(' ')
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
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
