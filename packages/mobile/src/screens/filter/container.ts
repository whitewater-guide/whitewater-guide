import { consumeRegion, consumeTags } from '@whitewater-guide/clients';
import { WithTags } from '@whitewater-guide/commons';
import { withI18n } from 'react-i18next';
import { compose } from 'recompose';
import { withLoading } from '../../components';
import { InnerProps, OuterProps } from './types';

export default compose<InnerProps, OuterProps>(
  consumeTags,
  consumeRegion(({ searchTerms, resetSearchTerms, setSearchTerms }) => ({
    searchTerms,
    resetSearchTerms,
    setSearchTerms,
  })),
  withLoading((props: WithTags) => props.tagsLoading),
  withI18n(),
);
