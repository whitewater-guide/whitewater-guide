import { compose, setDisplayName } from 'recompose';
import { withAdmin } from '../users';
import { withSectionsAdmin } from './containers/withSectionsAdmin';
import { withSections } from '../../commons/features/sections/withSections';

export default compose(
  setDisplayName('ListSectionsContainer'),
  withAdmin(),
  withSections(),
  withSectionsAdmin,
);
