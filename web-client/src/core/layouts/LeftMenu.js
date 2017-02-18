import React from 'react';
import {FlatLinkButton, LeftMenuSeparator} from '../components';
import {Route, Switch, Link} from 'react-router-dom';
import {indigo500} from 'material-ui/styles/colors';
import {allRoutes} from './routes';

export class LeftMenu extends React.Component {
  static propTypes = {};

  render() {
    return (
      <div style={styles.leftCol}>
        <div style={styles.logo}>
          <Link to="/">Logo goes here</Link>
        </div>
        <FlatLinkButton to="/regions" label="Regions" secondary={true}/>
        <LeftMenuSeparator/>
        <FlatLinkButton to="/rivers" label="All rivers" secondary={true}/>
        <FlatLinkButton to="/sections" label="All sections" secondary={true}/>
        <LeftMenuSeparator/>
        <FlatLinkButton to="/sources" label="Sources" secondary={true}/>
        <LeftMenuSeparator/>
        <Switch>
          {allRoutes.map(({path, exact, left}) =>
            (<Route key={path} path={path} exact={exact} component={left}/>)
          )}
        </Switch>
      </div>

    );
  }
}

const styles = {
  leftCol: {
    width: 240,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: indigo500,
  },
  logo: {
    alignSelf: 'stretch',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
};