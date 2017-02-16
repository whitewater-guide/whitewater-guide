import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import {Page403Unauthorized} from './Page403Unauthorized';
import {allRoutes} from './routes';

export class ContentLayout extends React.Component {
  static propTypes = {};

  render() {
    return (
      <Switch>
        <Route path="/" exact={true}>
          <Redirect to="/regions"/>
        </Route>
        {allRoutes.map(({path, exact, content}) =>
          (<Route key={path} path={path} exact={exact} component={content}/>)
        )}
        <Route path="/403" component={Page403Unauthorized}/>
      </Switch>

    );
  }
}
