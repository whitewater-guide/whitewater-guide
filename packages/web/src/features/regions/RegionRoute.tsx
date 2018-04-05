import React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Loading } from '../../components';
import { AdminRoute, EditorRoute } from '../../layout';
import { RegionProvider, selectRegion } from '../../ww-clients/features/regions';
import RegionAdmin from './admin';
import RegionDetails from './details';
import RegionForm from './form';

interface Props extends RouteComponentProps<{ regionId: string }> {
  selectRegion: (id: string | null) => void;
}

class RegionRoute extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.selectRegion(this.props.match.params.regionId);
  }

  componentWillUnmount() {
    this.props.selectRegion(null);
  }

  renderLoading = () => <Loading />;

  render() {
    const { match: { path, params } } = this.props;
    return (
      <RegionProvider regionId={params.regionId} renderLoading={this.renderLoading}>
        <Switch>
          <EditorRoute exact path={`${path}/settings`} component={RegionForm} />
          <AdminRoute exact path={`${path}/admin`} component={RegionAdmin} />
          <Route component={RegionDetails} />
        </Switch>
      </RegionProvider>
    );
  }
}

export default connect(
  undefined,
  { selectRegion },
)(RegionRoute as any);
