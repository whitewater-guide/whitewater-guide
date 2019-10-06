import { Region } from '@whitewater-guide/commons';
import { WithTranslation } from 'react-i18next';
import { NavigationScreenProp } from 'react-navigation';

export type OuterProps = Pick<NavigationScreenProp<any, any>, 'navigate'>;
export type InnerProps = OuterProps &
  WithTranslation & {
    openDownloadDialog: (region: Region) => void;
    regionInProgress: string | null; // region being downloaded for offline use
  } & { isFocused: boolean };
