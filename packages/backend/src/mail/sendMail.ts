import { castArray } from 'lodash';
import { createTransport } from 'nodemailer';

import config from '../config';
import logger from './logger';
import { render } from './templates/index';
import type { MailPayloadMap } from './types';
import { MailType } from './types';

let _transport: ReturnType<typeof createTransport> | undefined;

function getTransport(): ReturnType<typeof createTransport> {
  if (!_transport) {
    _transport = createTransport({
      host: config.MAIL_SMTP_SERVER,
      port: 465,
      secure: true,
      auth: {
        user: config.MAIL_NOREPLY_BOX,
        pass: config.MAIL_PASSWORD,
      },
      logger: logger as any,
    });
  }
  return _transport;
}

const SUBJECTS = new Map([
  [MailType.GORGE_UNHEALTHY, 'Some scripts are unhealthy'],
  [MailType.RESET_REQUEST, 'whitewater.guide password reset'],
  [MailType.RESET_SUCCESS, 'whitewater.guide password changed'],
  [MailType.VERIFICATION_REQUEST, 'whitewater.guide user verification'],
  [MailType.WELCOME_UNVERIFIED, 'Welcome to whitewater.guide'],
  [MailType.WELCOME_VERIFIED, 'Welcome to whitewater.guide'],
  [MailType.CONNECT_EMAIL_REQUEST, 'whitewater.guide email login request'],
  [MailType.CONNECT_EMAIL_SUCCESS, 'whitewater.guide email login confirmed'],
  [
    MailType.PUCON_PROMO_GENERATED,
    'New whitewater.guide + Pucon Kayak Retreat promocode',
  ],
]);

export async function sendMail<T extends keyof MailPayloadMap>(
  type: MailType,
  emails: string | string[],
  payload: MailPayloadMap[T],
): Promise<void> {
  const { PROTOCOL, API_DOMAIN, DEEP_LINKING_DOMAIN, contentPublicURL } =
    config;
  const data = {
    ...payload,
    baseURL: `${PROTOCOL}://${API_DOMAIN}`,
    deepLinkingURL: `${PROTOCOL}://${DEEP_LINKING_DOMAIN}`,
    contentURL: contentPublicURL,
  };
  const html = await render(type, data);
  const transport = getTransport();

  const recipients = castArray(emails);
  if (recipients.length === 0) {
    logger.error({ message: 'sendMail must have at least 1 recipient' });
    return;
  }
  const [to, ...cc] = recipients;

  await transport.sendMail({
    from: {
      name: 'whitewater.guide',
      address: config.MAIL_NOREPLY_BOX,
    },
    to,
    cc,
    subject: SUBJECTS.get(type),
    html,
  });
}
