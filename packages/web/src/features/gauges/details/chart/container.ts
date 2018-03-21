import { withRouter } from 'react-router';
import { compose, withProps } from 'recompose';
import { withFeatureIds } from '../../../../ww-clients/core';
import { withLastMeasurements, WithMeasurements } from '../../../../ww-clients/features/measurements';

export default compose<WithMeasurements, {}>(
  withRouter,
  withFeatureIds('gauge'),
  withProps({ days: 1 }),
  withLastMeasurements(),
);
