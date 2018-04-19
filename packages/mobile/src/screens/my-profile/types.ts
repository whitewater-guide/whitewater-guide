import { WithT } from '../../i18n';
import { WithMe } from '../../ww-clients/features/users';
import { UserInput } from '../../ww-commons';

export interface WithMutation {
  updateMyProfile: (user: UserInput) => Promise<any>;
}

export interface DispatchProps {
  logout: () => void;
}

export type InnerProps = WithT & WithMe & WithMutation & DispatchProps;
