import Container from '@material-ui/core/Container';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Loading } from '../components';
import SignInRoute from '../features/auth/signin';
import { AdminRoute } from './AdminRoute';
import { DRAWER_WIDTH, usePermanentDrawer } from './drawer';
import LogoutRoute from './LogoutRoute';
import Page403 from './Page403';
import Page404 from './Page404';

const LazyBannersRoute = React.lazy(
  () => import('../features/banners/BannersRoute'),
);
const LazyGroupsRoute = React.lazy(
  () => import('../features/groups/GroupsRoute'),
);
const LazyHistoryRoute = React.lazy(
  () => import('../features/history/HistoryRoute'),
);
const LazyRegionsRoute = React.lazy(
  () => import('../features/regions/RegionsRoute'),
);
const LazySourcesRoute = React.lazy(
  () => import('../features/sources/SourcesRoute'),
);
const LazyTagsRoute = React.lazy(() => import('../features/tags/TagsRoute'));
const LazySuggestionsRoute = React.lazy(
  () => import('../features/suggestions/SuggestionsRoute'),
);
const LazyUsersRoute = React.lazy(() => import('../features/users/UsersRoute'));

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    permanentDrawer: {
      paddingLeft: DRAWER_WIDTH,
    },
  }),
);

const RootRouter: React.FC = () => {
  const classes = useStyles();
  const permanentDrawer = usePermanentDrawer();
  return (
    <div
      className={clsx(classes.root, permanentDrawer && classes.permanentDrawer)}
    >
      <Container maxWidth="lg" className={classes.root}>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route exact path="/">
              <Redirect from="/" to="/regions" />
            </Route>

            <Route path="/regions" component={LazyRegionsRoute} />
            <Route path="/sources" component={LazySourcesRoute} />
            <Route path="/tags" component={LazyTagsRoute} />
            <Route path="/groups" component={LazyGroupsRoute} />
            <Route path="/banners" component={LazyBannersRoute} />
            <Route path="/history" component={LazyHistoryRoute} />
            <Route path="/suggestions" component={LazySuggestionsRoute} />
            <AdminRoute path="/users" component={LazyUsersRoute} />

            <Route path="/signin" component={SignInRoute} />
            <Route path="/logout">
              <LogoutRoute />
            </Route>

            <Route path="/403">
              <Page403 />
            </Route>

            <Route>
              <Page404 />
            </Route>
          </Switch>
        </Suspense>
      </Container>
    </div>
  );
};

export default RootRouter;
