import Grid from '@material-ui/core/Grid';
import { formatDistanceToNow } from '@whitewater-guide/clients';
import {
  GaugeCoreFragment,
  GaugeLatestMeasurementFragment,
} from '@whitewater-guide/schema';
import parseISO from 'date-fns/parseISO';
import isNil from 'lodash/isNil';
import React from 'react';

import { Row, Title } from '../../../layout/details';

interface Props {
  gauge: GaugeCoreFragment & GaugeLatestMeasurementFragment;
}

const GaugeFlow = React.memo<Props>(({ gauge }) => {
  const { latestMeasurement, flowUnit } = gauge;
  if (!flowUnit || !latestMeasurement) {
    return null;
  }
  const { timestamp, flow } = latestMeasurement;
  const fromNow = formatDistanceToNow(parseISO(timestamp), {
    addSuffix: true,
  });
  return (
    <Row>
      <Title>Flow</Title>
      <Grid>
        {!isNil(flow) && (
          <span>
            <b>{flow.toPrecision(3)}</b>
            {` ${flowUnit} ${fromNow}`}
          </span>
        )}
      </Grid>
    </Row>
  );
});

GaugeFlow.displayName = 'GaugeFlow';

export default GaugeFlow;
