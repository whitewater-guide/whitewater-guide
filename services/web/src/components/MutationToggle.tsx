import CircularProgress from '@material-ui/core/CircularProgress';
import Switch from '@material-ui/core/Switch';
import { sleep } from '@whitewater-guide/clients';
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

  onToggle = async (e: any, value: boolean) => {
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
          <CircularProgress size={28} />
        ) : (
          <Switch checked={this.props.enabled} onChange={this.onToggle} />
        )}
      </div>
    );
  }
}
