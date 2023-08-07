import type { RandomToken } from '~/auth';

export enum MailType {
  GORGE_UNHEALTHY = 'gorge-unhealthy',
  RESET_REQUEST = 'reset-request',
  RESET_SUCCESS = 'reset-success',
  VERIFICATION_REQUEST = 'verification-request',
  WELCOME_UNVERIFIED = 'welcome-unverified',
  WELCOME_VERIFIED = 'welcome-verified',
  CONNECT_EMAIL_REQUEST = 'connect-email-request',
  CONNECT_EMAIL_SUCCESS = 'connect-email-success',
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type MailPayloadMap = {
  [MailType.GORGE_UNHEALTHY]: GorgeUnhealthyPayload;
  [MailType.RESET_REQUEST]: ResetRequestPayload;
  [MailType.RESET_SUCCESS]: ResetSuccessPayload;
  [MailType.VERIFICATION_REQUEST]: VerificationRequestPayload;
  [MailType.WELCOME_UNVERIFIED]: WelcomeUnverifiedPayload;
  [MailType.WELCOME_VERIFIED]: WelcomeVerifiedPayload;
  [MailType.CONNECT_EMAIL_REQUEST]: ConnectEmailRequestPayload;
  [MailType.CONNECT_EMAIL_SUCCESS]: ConnectEmailSuccessPayload;
};

interface MailUser {
  id: string;
  name: string;
}

export interface WelcomeVerifiedPayload {
  user: MailUser;
}

export interface WelcomeUnverifiedPayload {
  user: MailUser;
  token: RandomToken;
}

export interface ResetRequestPayload {
  user: MailUser;
  token: RandomToken;
}

export interface ResetSuccessPayload {
  user: MailUser;
}

export interface ConnectEmailRequestPayload {
  email: string;
  user: MailUser;
  token: RandomToken;
}

export interface ConnectEmailSuccessPayload {
  user: MailUser;
}

export interface GorgeUnhealthyPayload {
  unhealthyMsg: string;
}

export type VerificationRequestPayload = WelcomeUnverifiedPayload;
