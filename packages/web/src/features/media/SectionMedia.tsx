import * as React from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router';
import { Container } from '../../layout/details';
import MediaForm from './form/MediaForm';
import MediaList from './list';

class SectionMedia extends React.PureComponent<RouteComponentProps<any>> {

  render() {
    return (
      <Container>
        <MediaList />
        <Route strict path={`${this.props.match.path}/media/new`} component={MediaForm} />
        <Route strict path={`${this.props.match.path}/media/:mediaId/settings`} component={MediaForm} />
      </Container>
    );
  }
}

export default withRouter(SectionMedia);
