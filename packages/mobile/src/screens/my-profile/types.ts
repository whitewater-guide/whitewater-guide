import { WithMe } from '@whitewater-guide/clients';
import { UserInput } from '@whitewater-guide/commons';
import { WithI18n } from 'react-i18next';

export interface WithMutation {
  updateMyProfile: (user: UserInput) => Promise<any>;
}

export interface DispatchProps {
  logout: () => void;
}

export type InnerProps = WithI18n & WithMe & WithMutation & DispatchProps;
