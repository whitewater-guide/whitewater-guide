import { sleep } from '@whitewater-guide/clients';
import CircularProgress from 'material-ui/CircularProgress';
import Toggle from 'material-ui/Toggle';
import React from 'react';

interface Props {
  id: string;
  enabled: boolean;
  toggle: (id: string, enabled: boolean) => Promise<any>;
}

interface State {
  loading: boolean;
}

export class MutationToggle extends React.PureComponent<Props, State> {
  state: State = { loading: false };

  stopPropagation = (event: React.SyntheticEvent<any>) =>
    event.stopPropagation();

  onToggle = async (e: React.SyntheticEvent<any>, value: boolean) => {
    this.setState({ loading: true });
    try {
      await Promise.all([
        this.props.toggle(this.props.id, value),
        sleep(1000), // For nicer UI
      ]);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <div onClick={this.stopPropagation}>
        {this.state.loading ? (
          <CircularProgress mode="indeterminate" size={28} />
        ) : (
          <Toggle toggled={this.props.enabled} onToggle={this.onToggle} />
        )}
      </div>
    );
  }
}
