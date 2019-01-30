import { withFeatureIds } from '@whitewater-guide/clients';
import { withRouter } from 'react-router';
import { compose } from 'recompose';

const container = compose<{ regionId: string }, any>(
  withRouter,
  withFeatureIds('region'),
);

export default container;
