import { NavigationScreenProp } from 'react-navigation';
import { WithT } from '../../i18n';
import { WithRegionsList } from '../../ww-clients/features/regions';

export type OuterProps = Pick<NavigationScreenProp<any, any>, 'navigate'>;
export type InnerProps = OuterProps & WithRegionsList & WithT;
