import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { listScripts } from '../../../api/sources';

class SourceForm extends Component {

  static propTypes = {
    name: PropTypes.string,
    script: PropTypes.string,
    url: PropTypes.string,
    harvestMode: PropTypes.string,
    cron: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  state = {
    availableScripts: [],
  };

  componentDidMount() {
    listScripts.callPromise()
      .then( availableScripts => this.setState({availableScripts}))
      .catch( err => console.log('List scripts error:', err));
  }

  render() {
    return (
      <div style={styles.form}>
        <TextField value={this.props.name} onChange={(e, name) => this.props.onChange({ name })} hintText="Name" floatingLabelText="Name" />

        <SelectField value={this.props.script} onChange={this.onScriptChange} floatingLabelText="Script">
          {this.state.availableScripts.map(item => (<MenuItem key={item} value={item} primaryText={item} />))}
        </SelectField>

        <TextField value={this.props.url} onChange={(e, url) => this.props.onChange({ url })} hintText="URL" floatingLabelText="URL" />

        <SelectField value={this.props.harvestMode} onChange={this.onHarvestModeChange} floatingLabelText="Harvest mode">
          <MenuItem value="allAtOnce" primaryText="All at once" />
          <MenuItem value="oneByOne" primaryText="One by one" />
        </SelectField>

        <TextField value={this.props.cron} onChange={(e, cron) => this.props.onChange({ cron })}
          hintText="Cron expression" floatingLabelText="Cron expression" />
      </div>
    );
  }

  onHarvestModeChange = (event, index, harvestMode) => {
    this.props.onChange({ harvestMode });
  };

  onScriptChange = (event, index, script) => {
    this.props.onChange({ script });
  };
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
}

export default SourceForm;