import { WithI18n } from 'react-i18next';
import { NavigationScreenProp } from 'react-navigation';
import { WithPremiumDialog } from '../../features/purchases';
import { Region } from '../../ww-commons';

export type OuterProps = Pick<NavigationScreenProp<any, any>, 'navigate'>;
export type InnerProps = OuterProps & WithI18n & WithPremiumDialog & {
  regionsListRefreshToken: number;
  openDownloadDialog: (region: Region) => void;
  regionInProgress: string | null; // region being downloaded for offline use
};
