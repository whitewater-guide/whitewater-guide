import { NavigationScreenProp } from 'react-navigation';
import { WithT } from '../../i18n';

export type OuterProps = Pick<NavigationScreenProp<any, any>, 'navigate'>;
export type InnerProps = OuterProps & WithT;
