import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withDeleteMutation } from '../../../apollo';
import { withLoading } from '../../../components';
import { withSectionsList, WithSectionsList } from '../../../ww-clients/features/sections';
import REMOVE_SECTION from './removeSection.mutation';

export default compose(
  withRouter,
  withSectionsList(),
  withDeleteMutation({
    mutation: REMOVE_SECTION,
    propName: 'removeSection',
    refetchQueries: ['listSections'],
  }),
  withLoading<WithSectionsList>(({ sections }) => sections.loading),
);
