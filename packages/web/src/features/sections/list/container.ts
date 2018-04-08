import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withDeleteMutation } from '../../../apollo';
import { WithSectionsList } from '../../../ww-clients/features/sections';
import REMOVE_SECTION from './removeSection.mutation';
import { SectionsListProps } from './types';

export default compose<SectionsListProps, WithSectionsList>(
  withRouter,
  // withSectionsList(),
  withDeleteMutation({
    mutation: REMOVE_SECTION,
    propName: 'removeSection',
    refetchQueries: ['listSections'],
  }),
);
