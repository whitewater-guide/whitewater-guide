import { createTransport } from 'nodemailer';
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

const transport = createTransport({
  host: process.env.MAIL_SMTP_SERVER,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_NOREPLY_BOX,
    pass: process.env.MAIL_PASSWORD,
  },
  logger: logger as any,
});

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
  const { PROTOCOL, APP_DOMAIN } = process.env;
  const data = {
    ...payload,
    baseURL: `${PROTOCOL}://${APP_DOMAIN}`,
  };
  const html = await render(type, data);
  await transport.sendMail({
    from: {
      name: 'whitewater.guide',
      address: process.env.MAIL_NOREPLY_BOX!,
    },
    sender: {
      name: 'whitewater.guide',
      address: process.env.MAIL_INFO_BOX!,
    },
    to: email,
    subject: SUBJECTS.get(type),
    html,
  });
}
