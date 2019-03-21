import { RawTimestamped } from '@db';
import { EditorSettings } from '@whitewater-guide/commons';
import { Overwrite } from 'type-zoo';

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
