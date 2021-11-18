import { createTransport } from 'nodemailer';

import config from '~/config';

import logger from '../logger';
import { render } from './templates';
import {
  MailType,
  ResetRequestPayload,
  ResetSuccessPayload,
  VerificationRequestPayload,
  WelcomeUnverifiedPayload,
  WelcomeVerifiedPayload,
} from './types';

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
  [MailType.WELCOME_VERIFIED, 'Welcome to whitewater.guide'],
  [MailType.WELCOME_UNVERIFIED, 'Welcome to whitewater.guide'],
  [MailType.RESET_REQUEST, 'whitewater.guide password reset'],
  [MailType.RESET_SUCCESS, 'whitewater.guide password changed'],
  [MailType.VERIFICATION_REQUEST, 'whitewater.guide user verification'],
]);

export async function sendMail(
  type: MailType.WELCOME_VERIFIED,
  email: string,
  payload: WelcomeVerifiedPayload,
): Promise<void>;
export async function sendMail(
  type: MailType.WELCOME_UNVERIFIED,
  email: string,
  payload: WelcomeUnverifiedPayload,
): Promise<void>;
export async function sendMail(
  type: MailType.RESET_REQUEST,
  email: string,
  payload: ResetRequestPayload,
): Promise<void>;
export async function sendMail(
  type: MailType.RESET_SUCCESS,
  email: string,
  payload: ResetSuccessPayload,
): Promise<void>;
export async function sendMail(
  type: MailType.VERIFICATION_REQUEST,
  email: string,
  payload: VerificationRequestPayload,
): Promise<void>;
export async function sendMail(
  type: MailType,
  email: string,
  payload: any,
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
  await transport.sendMail({
    from: {
      name: 'whitewater.guide',
      address: config.MAIL_NOREPLY_BOX,
    },
    to: email,
    subject: SUBJECTS.get(type),
    html,
  });
}
