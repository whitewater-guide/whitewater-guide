import { compose, setDisplayName } from 'recompose';
import { connect } from 'react-redux';
import { withAdmin } from '../users';
import { withSectionsAdmin } from './containers/withSectionsAdmin';
import { withSectionsList } from '../../commons/features/sections';
import { searchTermsSelector, updateSearchTerms, selectRegion } from '../../commons/features/regions';

export default compose(
  setDisplayName('ListSectionsContainer'),
  withAdmin(),
  withSectionsList(),
  withSectionsAdmin,
  connect(
    searchTermsSelector,
    { updateSearchTerms, selectRegion },
  ),
);
