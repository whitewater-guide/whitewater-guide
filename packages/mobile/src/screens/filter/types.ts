import { RegionContext } from '@whitewater-guide/clients';
import { WithTags } from '@whitewater-guide/commons';
import { WithTranslation } from 'react-i18next';
import { NavigationInjectedProps } from 'react-navigation';

export type InnerProps = NavigationInjectedProps &
  WithTranslation &
  WithTags &
  Pick<RegionContext, 'searchTerms' | 'setSearchTerms' | 'resetSearchTerms'>;

export type OuterProps = NavigationInjectedProps;
