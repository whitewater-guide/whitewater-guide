import * as passport from 'passport';
import { loadGraphqlFile } from '../../apollo/loadGraphqlFile';
import { RawTimestamped } from '../../db';
import { NamedResource, Timestamped } from '../../ww-commons';

export const UsersSchema = loadGraphqlFile('users');

export enum Role {
  USER = 1,
  ADMIN = 2,
  SUPERADMIN = 3,
}

export interface UserRaw extends NamedResource, RawTimestamped {
  avatar: string | null;
  email: string | null;
  role: number;
}

/**
 * This is graphql type
 */
export interface User extends NamedResource, Timestamped {
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
