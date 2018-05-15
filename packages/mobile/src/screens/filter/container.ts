import { translate } from 'react-i18next';
import { compose } from 'recompose';
import { withLoading } from '../../components';
import { consumeRegion } from '../../ww-clients/features/regions';
import { consumeTags } from '../../ww-clients/features/tags';
import { WithTags } from '../../ww-commons';
import { InnerProps, OuterProps } from './types';

export default compose<InnerProps, OuterProps>(
  consumeTags,
  consumeRegion(
    ({ searchTerms, resetSearchTerms, setSearchTerms }) => ({ searchTerms, resetSearchTerms, setSearchTerms }),
  ),
  withLoading((props: WithTags) => props.tagsLoading),
  translate(),
);
