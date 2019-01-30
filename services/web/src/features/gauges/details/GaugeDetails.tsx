import { CardMedia } from 'material-ui/Card';
import moment from 'moment';
import React from 'react';
import { Col } from 'react-grid-system';
import { Content, HarvestStatusIndicator } from '../../../components';
import Chart from '../../../components/chart';
import { CardHeader, EditorFooter } from '../../../layout';
import { Container, Row, Title } from '../../../layout/details';
import { Styles } from '../../../styles';
import { arrayToDMSString } from '@whitewater-guide/clients';
import { Gauge } from '@whitewater-guide/commons';
import { GaugeDetailsProps } from './types';

const styles: Styles = {
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  dataCol: {
    flex: 1,
  },
  chartCol: {
    flex: 3,
  },
};

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
    return <span>unknown</span>;
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
    return <span>unknown</span>;
  };

  renderName = () => {
    const {
      node: { name, url },
    } = this.props.gauge;
    if (url) {
      return (
        <a href={url} target="_blank">
          {name}
        </a>
      );
    } else {
      return name;
    }
  };

  render() {
    const {
      gauge: { node },
    } = this.props;
    return (
      <Content card>
        <CardHeader title={node.name} />
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <div style={styles.root}>
            <div style={styles.dataCol}>
              <Container>
                <Row>
                  <Title>Name</Title>
                  <Col>{this.renderName()}</Col>
                </Row>
                <Row>
                  <Title>Code</Title>
                  <Col>{node.code}</Col>
                </Row>
                <Row>
                  <Title>Location</Title>
                  <Col>
                    {node.location
                      ? arrayToDMSString(node.location.coordinates)
                      : ''}
                  </Col>
                </Row>
                <Row>
                  <Title>Status</Title>
                  <Col>
                    <HarvestStatusIndicator withText status={node.status} />
                  </Col>
                </Row>
                {!!node.flowUnit && (
                  <Row>
                    <Title>Flow</Title>
                    <Col>{this.renderFlow()}</Col>
                  </Row>
                )}
                {!!node.levelUnit && (
                  <Row>
                    <Title>Level</Title>
                    <Col>{this.renderLevel()}</Col>
                  </Row>
                )}
              </Container>
            </div>
            <div style={styles.chartCol}>
              <Chart gauge={node} />
            </div>
          </div>
        </CardMedia>
        <EditorFooter edit />
      </Content>
    );
  }
}

export default GaugeDetails;
