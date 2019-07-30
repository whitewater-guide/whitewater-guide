import Grid from '@material-ui/core/Grid';
import { Gauge } from '@whitewater-guide/commons';
import moment from 'moment';
import React from 'react';
import { Row, Title } from '../../../layout/details';

interface Props {
  gauge: Gauge;
}

const GaugeFlow: React.FC<Props> = React.memo(({ gauge }) => {
  const { lastMeasurement, flowUnit } = gauge;
  if (!flowUnit || !lastMeasurement) {
    return null;
  }
  const { timestamp, flow } = lastMeasurement;
  return (
    <Row>
      <Title>Flow</Title>
      <Grid>
        <span>
          <b>{flow.toPrecision(3)}</b>
          {` ${flowUnit} ${moment(timestamp).fromNow()}`}
        </span>
      </Grid>
    </Row>
  );
});

GaugeFlow.displayName = 'GaugeFlow';

export default GaugeFlow;
