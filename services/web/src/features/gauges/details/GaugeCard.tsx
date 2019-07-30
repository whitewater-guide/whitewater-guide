import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import { arrayToDMSString } from '@whitewater-guide/clients';
import { Gauge } from '@whitewater-guide/commons';
import React from 'react';
import { HarvestStatusIndicator } from '../../../components';
import { Chart } from '../../../components/chart';
import { Card, EditorFooter } from '../../../layout';
import { Row, Title } from '../../../layout/details';
import GaugeFlow from './GaugeFlow';
import GaugeLevel from './GaugeLevel';
import GaugeName from './GaugeName';

interface Props {
  gauge: Gauge;
}

export const GaugeCard: React.FC<Props> = React.memo(({ gauge }) => {
  return (
    <Card>
      <CardHeader title={gauge.name} />
      <CardContent>
        <Box display="flex" width="100%" height="100%" padding={1}>
          <Box flex={1}>
            <Grid container={true}>
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
                <Title>Status</Title>
                <Grid>
                  <HarvestStatusIndicator
                    withText={true}
                    status={gauge.status}
                  />
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
      <EditorFooter edit={true} />
    </Card>
  );
});

GaugeCard.displayName = 'GaugeCard';

export default GaugeCard;
