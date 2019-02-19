import { RegionProvider } from '@whitewater-guide/clients';
import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Loading } from '../../components';
import { AdminRoute, EditorRoute } from '../../layout';
import RegionAdmin from './admin';
import RegionDetails from './details';
import RegionForm from './form';

type Props = RouteComponentProps<{ regionId: string }>;

class RegionRoute extends React.PureComponent<Props> {
  renderLoading = () => <Loading />;

  render() {
    const {
      match: { path, params },
    } = this.props;
    return (
      <RegionProvider
        regionId={params.regionId}
        renderLoading={this.renderLoading}
      >
        <Switch>
          <EditorRoute
            exact={true}
            path={`${path}/settings`}
            component={RegionForm}
          />
          <AdminRoute
            exact={true}
            path={`${path}/admin`}
            component={RegionAdmin}
          />
          <Route component={RegionDetails} />
        </Switch>
      </RegionProvider>
    );
  }
}

export default RegionRoute;
