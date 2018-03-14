import * as React from 'react';
import { Container } from '../../layout/details';
import MediaList from './list';

export class SectionMedia extends React.PureComponent {

  render() {
    return (
      <Container>
        <MediaList />
      </Container>
    );
  }
}
