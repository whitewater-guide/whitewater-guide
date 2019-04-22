import { WithMe } from '@whitewater-guide/clients';
import { UserInput } from '@whitewater-guide/commons';
import { WithTranslation } from 'react-i18next';

export interface WithMutation {
  updateMyProfile: (user: UserInput) => Promise<any>;
}

export type InnerProps = WithTranslation & WithMe & WithMutation;
