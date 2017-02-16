import {withAdmin} from '../users';
import {withSections} from './containers/withSections';
import {withFeatureIds} from '../../core/hoc';
import {compose} from 'recompose';

export default compose(
  withAdmin(),
  withFeatureIds(),
  withSections({withRemove: true}),
);