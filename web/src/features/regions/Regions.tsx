import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import RegionForm from './form';
import RegionsList from './list';

const Regions: React.StatelessComponent = () => (
  <Switch>
    <Route exact path="/regions" component={RegionsList} />
    <Route exact path="/regions/new" component={RegionForm} />
  </Switch>
);

export default Regions;
