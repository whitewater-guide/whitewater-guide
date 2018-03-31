import passport from 'passport';
import { RawTimestamped } from '../../db';
import { EditorSettings } from '../../ww-commons';

export interface UserRaw extends RawTimestamped {
  id: string;
  name: string;
  avatar: string | null;
  email: string | null;
  role: number;
  language: string;
  imperial: boolean;
  editor_settings: EditorSettings | null;
}

export interface LoginRaw extends RawTimestamped {
  user_id: string;
  id: string;
  provider: string;
  username: string;
  tokens: {[key: string]: string};
  profile: passport.Profile;
}
