import * as passport from 'passport';
import { loadGraphqlFile } from '../../apollo/loadGraphqlFile';
import { RawTimestamped } from '../../db';
import { NamedResource } from '../../ww-commons';

export const UsersSchema = loadGraphqlFile('users');

export interface UserRaw extends NamedResource, RawTimestamped {
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

export { Role, User } from '../../ww-commons';
