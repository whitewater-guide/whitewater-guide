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

const GaugeLevel = React.memo<Props>(({ gauge }) => {
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
