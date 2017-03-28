import {withAdmin} from '../users';
import {withSections} from './containers/withSections';
import {withFeatureIds} from '../../commons/core';
import {compose} from 'recompose';

export default compose(
  withAdmin(),
  withFeatureIds(),
  withSections({withRemove: true}),
);