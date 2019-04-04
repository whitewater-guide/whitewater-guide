import { Region } from '@whitewater-guide/commons';
import { WithTranslation } from 'react-i18next';
import { NavigationScreenProp } from 'react-navigation';
import { WithPremiumDialog } from '../../features/purchases';

export type OuterProps = Pick<NavigationScreenProp<any, any>, 'navigate'>;
export type InnerProps = OuterProps &
  WithTranslation &
  WithPremiumDialog & {
    regionsListRefreshToken: number;
    openDownloadDialog: (region: Region) => void;
    regionInProgress: string | null; // region being downloaded for offline use
  } & { isFocused: boolean };
