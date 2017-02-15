import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {Page403Unauthorized} from './Page403Unauthorized';
import {regionsRoutes} from '../../features/regions';
import {sourcesRoutes} from '../../features/sources';
import {sectionsRoutes} from '../../features/sections';

export class ContentLayout extends React.Component {
  static propTypes = {};

  render() {
    const allRoutes = [
      ...sourcesRoutes,
      ...regionsRoutes,
      ...sectionsRoutes,
    ];
    return (
      <Switch>
        {allRoutes.map(({path, exact, content}) =>
          (<Route key={path} path={path} exact={exact} component={content}/>)
        )}
        <Route path="/403" component={Page403Unauthorized}/>
      </Switch>

    );
  }
}
