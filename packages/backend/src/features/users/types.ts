import {
  EditorSettings,
  Overwrite,
  SocialMediaAccount,
} from '@whitewater-guide/commons';

import { RawTimestamped } from '~/db';

export type TokenClaim = 'verification' | 'passwordReset';

export interface RawToken {
  claim: TokenClaim;
  value: string;
  expires: number;
}

export interface UserRaw extends RawTimestamped {
  id: string;
  name: string;
  avatar: string | null;
  email: string | null;
  admin: boolean;
  language: string;
  imperial: boolean;
  editor_settings: EditorSettings | null;
  accounts: SocialMediaAccount[] | null;

  password: string | null;
  verified: boolean;
  tokens: RawToken[];
}

export type UserRawInput = Overwrite<Partial<UserRaw>, { tokens?: string }>;

export interface LoginRaw extends RawTimestamped {
  user_id: string;
  id: string;
  provider: string;
  username: string;
  tokens: { [key: string]: string };
  profile: any;
}
