import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withDeleteMutation } from '../../../apollo';
import REMOVE_SECTION from './removeSection.mutation';
import { OuterProps, SectionsListProps } from './types';

export default compose<SectionsListProps, OuterProps>(
  withRouter,
  withDeleteMutation({
    mutation: REMOVE_SECTION,
    propName: 'removeSection',
    refetchQueries: ['listSections'],
  }),
);
