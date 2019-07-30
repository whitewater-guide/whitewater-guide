import Grid from '@material-ui/core/Grid';
import { Gauge } from '@whitewater-guide/commons';
import moment from 'moment';
import React from 'react';
import { Row, Title } from '../../../layout/details';

interface Props {
  gauge: Gauge;
}

const GaugeLevel: React.FC<Props> = React.memo(({ gauge }) => {
  const { lastMeasurement, levelUnit } = gauge;
  if (!levelUnit || !lastMeasurement) {
    return null;
  }
  const { timestamp, level } = lastMeasurement;
  return (
    <Row>
      <Title>Level</Title>
      <Grid>
        <span>
          <b>{level.toPrecision(3)}</b>
          {` ${levelUnit} ${moment(timestamp).fromNow()}`}
        </span>
      </Grid>
    </Row>
  );
});

GaugeLevel.displayName = 'GaugeLevel';

export default GaugeLevel;
