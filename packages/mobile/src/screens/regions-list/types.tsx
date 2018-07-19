import { NavigationScreenProp } from 'react-navigation';
import { WithPremiumDialog } from '../../features/purchases';
import { WithT } from '../../i18n';

export type OuterProps = Pick<NavigationScreenProp<any, any>, 'navigate'>;
export type InnerProps = OuterProps & WithT & WithPremiumDialog & {
  regionsListRefreshToken: number;
};
