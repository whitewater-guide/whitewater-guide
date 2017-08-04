import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import {allRoutes} from './routes';

export class Breadcrumbs extends React.Component {
  static propTypes = {};

  render() {
    return (
      <Switch>
        <Route path="/" exact={true}>
          <Redirect to="/regions"/>
        </Route>
        {allRoutes.map(({path, exact, top}) =>
          (<Route key={path} path={path} exact={exact} component={top}/>)
        )}
      </Switch>

    );
  }
}
