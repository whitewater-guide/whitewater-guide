import { NavigationScreenProp } from 'react-navigation';
import { WithPremiumDialog } from '../../features/purchases';
import { WithT } from '../../i18n';
import { Region } from '../../ww-commons';

export type OuterProps = Pick<NavigationScreenProp<any, any>, 'navigate'>;
export type InnerProps = OuterProps & WithT & WithPremiumDialog & {
  regionsListRefreshToken: number;
  openDownloadDialog: (region: Region) => void;
  regionInProgress: string | null; // region being downloaded for offline use
};
