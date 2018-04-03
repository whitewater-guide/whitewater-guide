import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { withFeatureIds } from '../../../../ww-clients/core';

const container = compose<{regionId: string}, any>(
  withRouter,
  withFeatureIds('region'),
);

export default container;
