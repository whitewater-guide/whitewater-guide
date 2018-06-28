import { NavigationInjectedProps } from 'react-navigation';
import { WithT } from '../../i18n';
import { RegionContext } from '../../ww-clients/features/regions';
import { WithTags } from '../../ww-commons';

export type InnerProps =
  NavigationInjectedProps &
  WithT &
  WithTags &
  Pick<RegionContext, 'searchTerms' | 'setSearchTerms' | 'resetSearchTerms'>;

export type OuterProps = NavigationInjectedProps;
