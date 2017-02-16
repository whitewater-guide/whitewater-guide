import {withFeatureIds} from '../../core/hoc';
import {withAdmin} from '../users';
import {compose} from 'recompose';

export default compose(
  withAdmin(),
  withFeatureIds(),
);