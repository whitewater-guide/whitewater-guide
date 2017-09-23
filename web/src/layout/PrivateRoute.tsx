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

export class PrivateRoute extends React.PureComponent<RouteProps> {
  wrappedComponent: React.ComponentType;

  constructor(props: RouteProps) {
    super(props);
    this.wrappedComponent = container(props.component!);
  }

  componentWillReceiveProps(next: RouteProps) {
    if (this.props.component !== next.component) {
      this.wrappedComponent = container(next.component!);
    }
  }

  render() {
    const { component, ...rest } = this.props;
    return (
      <Route {...rest} component={this.wrappedComponent} />
    );
  }
}
