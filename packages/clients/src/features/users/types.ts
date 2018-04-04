import { User } from '../../../ww-commons/features/users';

export interface WithMe {
  me: User | null;
}
