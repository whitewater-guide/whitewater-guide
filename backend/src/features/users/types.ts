import * as passport from 'passport';
import { RawTimestamped } from '../../db';

export interface UserRaw extends RawTimestamped {
  id: string;
  name: string;
  avatar: string | null;
  email: string | null;
  role: number;
}

export interface LoginRaw extends RawTimestamped {
  user_id: string;
  id: string;
  provider: string;
  username: string;
  tokens: {[key: string]: string};
  profile: passport.Profile;
}

export { Role, User, isAdmin, isSuperAdmin } from '../../ww-commons';
