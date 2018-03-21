import { CardMedia } from 'material-ui/Card';
import { Tab } from 'material-ui/Tabs';
import moment from 'moment';
import React from 'react';
import { Col } from 'react-grid-system';
import { Content, HarvestStatusIndicator, Tabs } from '../../../components';
import { AdminFooter } from '../../../layout';
import { Container, Row, Title } from '../../../layout/details';
import { arrayToDMSString } from '../../../ww-clients/utils';
import { Gauge } from '../../../ww-commons';
import { GaugeDetailsProps } from './types';

class GaugeDetails extends React.PureComponent<GaugeDetailsProps> {
  renderLevel = () => {
    const { lastMeasurement, levelUnit }: Gauge = this.props.gauge.node;
    if (lastMeasurement) {
      const { timestamp, level } = lastMeasurement;
      return (
        <span>
          <b>{level.toPrecision(3)}</b>
          {` ${levelUnit} ${moment(timestamp).fromNow()}`}
        </span>
      );
    }
    return (
      <span>
        unknown
      </span>
    );
  };

  renderFlow = () => {
    const { lastMeasurement, flowUnit }: Gauge = this.props.gauge.node;
    if (lastMeasurement) {
      const { timestamp, flow } = lastMeasurement;
      return (
        <span>
          <b>{flow.toPrecision(3)}</b>
          {` ${flowUnit} ${moment(timestamp).fromNow()}`}
        </span>
      );
    }
    return (
      <span>
        unknown
      </span>
    );
  };

  render() {
    const { gauge: { node } } = this.props;
    return (
      <Content card>
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <div style={{ width: '100%', height: '100%' }} >
            <Tabs>
              <Tab label="Details" value={`#main`}>
                <Container>
                  <Row>
                    <Title>Name</Title>
                    <Col>{node.name}</Col>
                  </Row>
                  <Row>
                    <Title>Code</Title>
                    <Col>{node.code}</Col>
                  </Row>
                  <Row>
                    <Title>Location</Title>
                    <Col>{node.location ? arrayToDMSString(node.location.coordinates) : ''}</Col>
                  </Row>
                  <Row>
                    <Title>Status</Title>
                    <Col><HarvestStatusIndicator withText status={node.status} /></Col>
                  </Row>
                  <Row>
                    <Title>Flow</Title>
                    <Col>{this.renderFlow()}</Col>
                  </Row>
                  <Row>
                    <Title>Level</Title>
                    <Col>{this.renderLevel()}</Col>
                  </Row>
                </Container>
              </Tab>
              <Tab label="Chart" value="#chart">
                <h1>Chart</h1>
              </Tab>
            </Tabs>
          </div>
        </CardMedia>

          <AdminFooter edit/>
      </Content>
    );
  }
}

export default GaugeDetails;
