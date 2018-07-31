import { WithI18n } from 'react-i18next';
import { WithMe } from '../../ww-clients/features/users';
import { UserInput } from '../../ww-commons';

export interface WithMutation {
  updateMyProfile: (user: UserInput) => Promise<any>;
}

export interface DispatchProps {
  logout: () => void;
}

export type InnerProps = WithI18n & WithMe & WithMutation & DispatchProps;
