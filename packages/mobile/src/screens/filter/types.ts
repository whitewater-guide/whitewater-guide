import { RegionContext } from '@whitewater-guide/clients';
import { WithTags } from '@whitewater-guide/commons';
import { WithI18n } from 'react-i18next';
import { NavigationInjectedProps } from 'react-navigation';

export type InnerProps = NavigationInjectedProps &
  WithI18n &
  WithTags &
  Pick<RegionContext, 'searchTerms' | 'setSearchTerms' | 'resetSearchTerms'>;

export type OuterProps = NavigationInjectedProps;
