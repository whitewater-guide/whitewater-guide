import { indigo500 } from 'material-ui/styles/colors';
import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { FlatLinkButton, LeftMenuSeparator } from '../components';
import { Styles } from '../styles';
import { allRoutes } from './routes';

const styles: Styles = {
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

export const LeftMenu: React.StatelessComponent = () => (
  <div style={styles.leftCol}>
    <div style={styles.logo}>
      <Link to="/">Logo goes here</Link>
    </div>
    <FlatLinkButton to="/regions" label="Regions" secondary />
    <LeftMenuSeparator/>
    <FlatLinkButton to="/rivers" label="All rivers" secondary />
    <FlatLinkButton to="/sections" label="All sections" secondary />
    <LeftMenuSeparator/>
    <FlatLinkButton to="/sources" label="Sources" secondary />
    <FlatLinkButton to="/users" label="Users" secondary />
    <FlatLinkButton to="/tags" label="Tags" secondary />
    <LeftMenuSeparator/>
    <Switch>
      {allRoutes.map(({ path, exact, left }) =>
        (<Route key={path} path={path} exact={exact} component={left}/>),
      )}
    </Switch>
  </div>
);
