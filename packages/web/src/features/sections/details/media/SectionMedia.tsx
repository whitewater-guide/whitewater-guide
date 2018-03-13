import { groupBy } from 'lodash';
import * as React from 'react';
import { Col } from 'react-grid-system';
import { Container, Row } from '../../../../layout/details';
import { WithMediaList } from './conatiner';
import GridGallery from './GridGallery';

const SectionMedia: React.StatelessComponent<WithMediaList> = ({ mediaBySection: { nodes } }) => {
  const { photo = [], video = [], blog = [] } = groupBy(nodes, 'kind');
  return (
    <Container>
      <Row>
        <Col>
          <h2>Photos</h2>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <GridGallery media={photo} />
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Videos</h2>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <GridGallery media={video} />
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Blogs</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <div>
            {JSON.stringify(blog)}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SectionMedia;
