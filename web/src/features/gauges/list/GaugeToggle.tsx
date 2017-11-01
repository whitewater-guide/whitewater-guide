import LinearProgress from 'material-ui/LinearProgress';
import Toggle from 'material-ui/Toggle';
import * as React from 'react';

interface Props {
  id: string;
  enabled: boolean;
  toggleGauge: (id: string, enabled: boolean) => Promise<any>;
}

interface State {
  loading: boolean;
}

export default class GaugeToggle extends React.PureComponent<Props, State> {
  state: State = { loading: false };

  onToggle = async (e: any, value: boolean) => {
    this.setState({ loading: true });
    try {
      await this.props.toggleGauge(this.props.id, value);
    } catch (e) {}
    this.setState({ loading: false });
  };

  render() {
    return this.state.loading ?
      <LinearProgress mode="indeterminate" /> :
      <Toggle toggled={this.props.enabled} onToggle={this.onToggle} />;
  }
}
