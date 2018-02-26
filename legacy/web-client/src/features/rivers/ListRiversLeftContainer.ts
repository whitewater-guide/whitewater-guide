import {withFeatureIds} from '../../commons/core';
import {withAdmin} from '../users';
import {compose} from 'recompose';

export default compose(
  withAdmin(),
  withFeatureIds(),
);