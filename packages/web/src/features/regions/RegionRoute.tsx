import React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { selectRegion } from '../../ww-clients/features/regions';
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

  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.path}/settings`} component={RegionForm} />
        <Route exact path={`${match.path}/admin`} component={RegionAdmin} />
        <Route component={RegionDetails} />
      </Switch>
    );
  }
}

export default connect(
  undefined,
  { selectRegion },
)(RegionRoute as any);
