import Grid from '@material-ui/core/Grid';
import { formatDistanceToNow } from '@whitewater-guide/clients';
import { Gauge } from '@whitewater-guide/commons';
import parseISO from 'date-fns/parseISO';
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
  const fromNow = formatDistanceToNow(parseISO(timestamp), {
    addSuffix: true,
  });
  return (
    <Row>
      <Title>Flow</Title>
      <Grid>
        <span>
          <b>{flow.toPrecision(3)}</b>
          {` ${flowUnit} ${fromNow}`}
        </span>
      </Grid>
    </Row>
  );
});

GaugeFlow.displayName = 'GaugeFlow';

export default GaugeFlow;
