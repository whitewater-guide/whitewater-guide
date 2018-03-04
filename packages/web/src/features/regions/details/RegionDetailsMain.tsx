import * as React from 'react';
import { Col } from 'react-grid-system';
import * as ReactMarkdown from 'react-markdown';
import { Container, Row, Title } from '../../../layout/details';
import { stringifySeason } from '../../../ww-clients/utils';
import { Region } from '../../../ww-commons/features/regions';

interface Props {
  region: Region;
}

const RegionDetailsMain: React.StatelessComponent<Props> = ({ region }) => (
  <Container>
    <Row>
      <Title>Name</Title>
      <Col>{region.name}</Col>
    </Row>
    <Row>
      <Title>Season</Title>
      <Col>{stringifySeason(region.seasonNumeric)}</Col>
    </Row>
    <Row>
      <Col xs={12}>
        <ReactMarkdown source={region.description || ''} />
      </Col>
    </Row>
  </Container>
);

export default RegionDetailsMain;
