import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import { arrayToDMSString } from '@whitewater-guide/clients';
import React from 'react';

import { HarvestStatusIndicator } from '../../../components';
import { Chart } from '../../../components/chart';
import { Card, EditorFooter } from '../../../layout';
import { Row, Title } from '../../../layout/details';
import type { GaugeDetailsQuery } from './gaugeDetails.generated';
import GaugeFlow from './GaugeFlow';
import GaugeLevel from './GaugeLevel';
import GaugeName from './GaugeName';

interface Props {
  gauge: NonNullable<GaugeDetailsQuery['gauge']>;
}

export const GaugeCard = React.memo<Props>(({ gauge }) => (
  <Card>
    <CardHeader title={gauge.name} />
    <CardContent>
      <Box display="flex" width="100%" height="100%" padding={1}>
        <Box flex={1}>
          <Grid container>
            <Row>
              <Title>Name</Title>
              <Grid>
                <GaugeName gauge={gauge} />
              </Grid>
            </Row>

            <Row>
              <Title>Code</Title>
              <Grid>{gauge.code}</Grid>
            </Row>

            <Row>
              <Title>Location</Title>
              <Grid>
                {gauge.location
                  ? arrayToDMSString(gauge.location.coordinates)
                  : ''}
              </Grid>
            </Row>

            <Row>
              <Title>Timezone</Title>
              <Grid>{gauge.timezone}</Grid>
            </Row>

            <Row>
              <Title>Status</Title>
              <Grid>
                <HarvestStatusIndicator withText status={gauge.status} />
              </Grid>
            </Row>

            <GaugeFlow gauge={gauge} />
            <GaugeLevel gauge={gauge} />
          </Grid>
        </Box>
        <Box flex={3}>
          <Chart gauge={gauge} />
        </Box>
      </Box>
    </CardContent>
    <EditorFooter edit />
  </Card>
));

GaugeCard.displayName = 'GaugeCard';

export default GaugeCard;
