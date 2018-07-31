import { WithI18n } from 'react-i18next';
import { NavigationInjectedProps } from 'react-navigation';
import { RegionContext } from '../../ww-clients/features/regions';
import { WithTags } from '../../ww-commons';

export type InnerProps =
  NavigationInjectedProps &
  WithI18n &
  WithTags &
  Pick<RegionContext, 'searchTerms' | 'setSearchTerms' | 'resetSearchTerms'>;

export type OuterProps = NavigationInjectedProps;
