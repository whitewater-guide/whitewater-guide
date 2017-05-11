import { compose, setDisplayName, withState } from 'recompose';
import { withAdmin } from '../users';
import { withSectionsAdmin } from './containers/withSectionsAdmin';
import { withSectionsList } from '../../commons/features/sections';

export default compose(
  setDisplayName('ListSectionsContainer'),
  withAdmin(),
  withState('searchString', 'onSearch', ''),
  withSectionsList(),
  withSectionsAdmin,
);
