import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { branch, compose, renderComponent } from 'recompose';
import { WithRegion, withRegion } from '../ww-clients/features/regions';

const container = compose(
  withRegion,
  branch<WithRegion>(
    props => !(props.region && props.region.node!.editable),
    renderComponent(() => (<Redirect to="/403" />)),
  ),
);

export class EditorRoute extends React.PureComponent<RouteProps> {
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
