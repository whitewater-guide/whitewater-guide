import { stringifySeason, useRegion } from '@whitewater-guide/clients';
import React from 'react';
import { Col } from 'react-grid-system';
import ReactMarkdown from 'react-markdown';
import { Container, Row, Title } from '../../../layout/details';

const RegionDetailsMain: React.FC = () => {
  const { node } = useRegion();
  if (!node) {
    return null;
  }
  return (
    <Container>
      <Row>
        <Title>Name</Title>
        <Col>{node.name}</Col>
      </Row>
      <Row>
        <Title>Season</Title>
        <Col>{stringifySeason(node.seasonNumeric)}</Col>
      </Row>
      <Row>
        <Col xs={12}>
          <ReactMarkdown source={node.description || ''} />
        </Col>
      </Row>
    </Container>
  );
};

export default RegionDetailsMain;
