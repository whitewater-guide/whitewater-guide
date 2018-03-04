import { groupBy } from 'lodash';
import * as React from 'react';
import { Container, Row } from '../../../../layout/details';
import { Section } from '../../../../ww-commons/features/sections';

interface Props {
  section: Section;
}

export const SectionMedia: React.StatelessComponent<Props> = ({ section }) => {
  const { nodes = [] } = section.media || {};
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
