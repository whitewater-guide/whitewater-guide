import debounce from 'lodash/debounce';
import React from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';

interface State {
  refreshing: boolean;
}

export class RefreshIndicator extends React.PureComponent<RefreshControlProps, State> {
  constructor(props: RefreshControlProps) {
    super(props);
    this.state = { refreshing: props.refreshing };
  }

  updateState = debounce(this.setState, 400);

  componentWillReceiveProps(next: RefreshControlProps) {
    this.updateState({ refreshing: next.refreshing });
  }

  render() {
    return (
      <RefreshControl {...this.props} refreshing={this.state.refreshing} />
    );
  }
}
