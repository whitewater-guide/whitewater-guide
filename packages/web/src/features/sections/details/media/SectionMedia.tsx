import { groupBy } from 'lodash';
import * as React from 'react';
import { Container, Row } from '../../../../layout/details';
import { WithMediaList } from './conatiner';

const SectionMedia: React.StatelessComponent<WithMediaList> = ({ mediaBySection: { nodes } }) => {
  const { photo = [], video = [], blog = [] } = groupBy(nodes, 'kind');
  return (
    <Container>
      <Row>
        <h1>Photos</h1>
        <div>
          {JSON.stringify(photo)}
        </div>
      </Row>
      <Row>
        <h1>Videos</h1>
        <div>
          {JSON.stringify(video)}
        </div>
      </Row>
      <Row>
        <h1>Blogs</h1>
        <div>
          {JSON.stringify(blog)}
        </div>
      </Row>
    </Container>
  );
};

export default SectionMedia;
