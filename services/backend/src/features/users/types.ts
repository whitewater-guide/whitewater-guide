import { RawTimestamped } from '@db';
import { EditorSettings } from '@whitewater-guide/commons';

export interface UserRaw extends RawTimestamped {
  id: string;
  name: string;
  avatar: string | null;
  email: string | null;
  admin: boolean;
  language: string;
  imperial: boolean;
  editor_settings: EditorSettings | null;
}

export interface LoginRaw extends RawTimestamped {
  user_id: string;
  id: string;
  provider: string;
  username: string;
  tokens: { [key: string]: string };
  profile: any;
}
