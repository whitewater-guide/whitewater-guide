import { RandomToken } from '../local/utils';

export enum MailType {
  WELCOME_UNVERIFIED = 'welcome-unverified',
  WELCOME_VERIFIED = 'welcome-verified',
  VERIFICATION_REQUEST = 'verification-request',
  RESET_REQUEST = 'reset-request',
  RESET_SUCCESS = 'reset-success',
}

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

export type VerificationRequestPayload = WelcomeUnverifiedPayload;
