import { compose } from 'recompose';
import { withRiver } from '../../commons/features/rivers';
import { withAdmin } from '../users';
import { withSectionsAdmin } from '../sections';
import { spinnerWhileLoading } from '../../core/components';

export default compose(
  withAdmin(),
  withRiver(),
  withSectionsAdmin,
  spinnerWhileLoading(props => props.riverLoading),
);
