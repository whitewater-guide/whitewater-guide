import React, {Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {ValidationError} from 'meteor/mdg:validation-error';
import {createSource, listScripts} from '../../../api/sources';

export default class NewSource extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
  };

  state = {
    name: '',
    url: '',
    script: '',
    interval: 60,
    harvestMode: null,
    errors: {},
  };

  availableScripts = [];

  componentDidMount() {
    console.log('List sources mounted');
    listScripts.callPromise()
      .then( result => {this.availableScripts = result})
      .catch( err => console.log('List scripts error:', err));
  }

  render() {
    const actions = [
      <FlatButton label="Cancel" primary={true} onMouseUp={this.onCreate} onTouchEnd={this.props.onClose}/>,
      <FlatButton label="Add" primary={true} onMouseUp={this.onCreate} onTouchEnd={this.onCreate}/>
    ];
    return (
      <Dialog title="New Source" bodyStyle={styles.dialogBody} actions={actions} open={this.props.open} onRequestClose={this.props.onClose}>
        <TextField value={this.state.name} onChange={(e,name) => this.setState({name})} hintText="Name" floatingLabelText="Name"/>
        
        <SelectField value={this.state.script} onChange={this.onScriptChange} floatingLabelText="Script">
          { this.availableScripts.map(item => (<MenuItem key={item} value={item} primaryText={item}/>))}
        </SelectField>

        <TextField value={this.state.url} onChange={(e,url) => this.setState({url})}  hintText="URL" floatingLabelText="URL"/>

        <SelectField value={this.state.harvestMode} onChange={this.onHarvestModeChange} floatingLabelText="Harvest mode">
          <MenuItem value="allAtOnce" primaryText="All at once" />
          <MenuItem value="oneByOne" primaryText="One by one" />
        </SelectField>

        <TextField value={this.state.interval} onChange={(e,interval) => this.setState({interval})} 
                   hintText="Interval" floatingLabelText="Interval"
                   type="number"/>
      </Dialog>
    );
  }

  onHarvestModeChange = (event, index, harvestMode) => this.setState({harvestMode});
  onScriptChange = (event, index, script) => this.setState({script});

  onCreate = () => {
    createSource.callPromise(this.state)
      .then(result => this.props.onClose())
      .catch(err => {
        if (ValidationError.is(err)){
          const errors = {};
          err.details.forEach((fieldError) => {
            errors[fieldError.name] = fieldError.type;
          });
          this.setState({errors});
        }
      });
  };

}

const styles = {
  dialogBody: {
    display: 'flex',
    flexDirection: 'column',
  }
}