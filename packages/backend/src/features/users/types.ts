import { Sql } from '~/db';

/**
 * User with extra fields, see connector's field map
 */
export interface ResolvableUser extends Sql.Users {
  accounts: Sql.Accounts[] | null;
  editor: boolean;
  has_password: boolean;
}
