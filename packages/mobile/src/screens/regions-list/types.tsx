import { NavigationScreenProp } from 'react-navigation';
import { WithT } from '../../i18n';
import { Region } from '../../ww-commons';

export type OuterProps = Pick<NavigationScreenProp<any, any>, 'navigate'>;
export type InnerProps = OuterProps & WithT & {
  buyPremium: (region: Region) => void;
  regionsListRefreshToken: number;
};
