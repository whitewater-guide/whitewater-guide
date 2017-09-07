import * as React from 'react';
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router-dom';
import { branch, compose, renderComponent } from 'recompose';
import { withLoading } from '../components/withLoading';
import { withMe, WithMe } from '../ww-clients/features/users';

const container = compose(
  withMe(),
  withLoading<WithMe>(props => props.meLoading),
  branch<WithMe>(
    props => !props.isAdmin,
    renderComponent(() => (<Redirect to="/403" />)),
  ),
);

export const PrivateRoute: React.StatelessComponent<RouteProps> = ({ component, ...rest }) => (
  <Route {...rest} component={container(component!)} />
);
