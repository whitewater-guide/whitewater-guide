import Grid from '@material-ui/core/Grid';
import { formatDistanceToNow } from '@whitewater-guide/clients';
import { Gauge } from '@whitewater-guide/commons';
import parseISO from 'date-fns/parseISO';
import isNil from 'lodash/isNil';
import React from 'react';
import { Row, Title } from '../../../layout/details';
interface Props {
  gauge: Gauge;
}

const GaugeLevel: React.FC<Props> = React.memo(({ gauge }) => {
  const { latestMeasurement, levelUnit } = gauge;
  if (!levelUnit || !latestMeasurement) {
    return null;
  }
  const { timestamp, level } = latestMeasurement;
  const fromNow = formatDistanceToNow(parseISO(timestamp), {
    addSuffix: true,
  });
  return (
    <Row>
      <Title>Level</Title>
      <Grid>
        {!isNil(level) && (
          <span>
            <b>{level.toPrecision(3)}</b>
            {` ${levelUnit} ${fromNow}`}
          </span>
        )}
      </Grid>
    </Row>
  );
});

GaugeLevel.displayName = 'GaugeLevel';

export default GaugeLevel;
