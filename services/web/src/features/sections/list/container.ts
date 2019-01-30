import { WithSectionsList } from '@whitewater-guide/clients';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withDeleteMutation } from '../../../apollo';
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
