import React, {Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import {ValidationError} from 'meteor/mdg:validation-error';
import {createSource, listScripts} from '../../../api/sources';
import adminOnly from '../../hoc/adminOnly';
import {withRouter} from 'react-router';

class NewSource extends Component {

  static propTypes = {
    router: PropTypes.object,
  };

  state = {
    name: '',
    url: '',
    script: '',
    interval: 60,
    harvestMode: null,
    errors: {},
    availableScripts: [],
  }

  componentDidMount() {
    listScripts.callPromise()
      .then( availableScripts => this.setState({availableScripts}))
      .catch( err => console.log('List scripts error:', err));
  }

  render() {
    return (
      <div style={styles.container}>
      <Paper style={styles.paper}>
        <h1>New source</h1>
        <TextField value={this.state.name} onChange={(e,name) => this.setState({name})} hintText="Name" floatingLabelText="Name"/>
        
        <SelectField value={this.state.script} onChange={this.onScriptChange} floatingLabelText="Script">
          { this.state.availableScripts.map(item => (<MenuItem key={item} value={item} primaryText={item}/>))}
        </SelectField>

        <TextField value={this.state.url} onChange={(e,url) => this.setState({url})}  hintText="URL" floatingLabelText="URL"/>

        <SelectField value={this.state.harvestMode} onChange={this.onHarvestModeChange} floatingLabelText="Harvest mode">
          <MenuItem value="allAtOnce" primaryText="All at once" />
          <MenuItem value="oneByOne" primaryText="One by one" />
        </SelectField>

        <TextField value={this.state.interval} onChange={(e,interval) => this.setState({interval})} 
                   hintText="Interval" floatingLabelText="Interval"
                   type="number"/>
        <div style={styles.buttonsHolder}>
          <FlatButton label="Cancel" primary={true} onTouchTap={this.onCancel}/>
          <FlatButton label="Add" primary={true} onTouchTap={this.onCreate}/>
        </div>
      </Paper>
      </div>
    );
  }

  onHarvestModeChange = (event, index, harvestMode) => this.setState({harvestMode});
  onScriptChange = (event, index, script) => this.setState({script});

  onCreate = () => {
    createSource.callPromise(this.state)
      .then(result => this.props.router.goBack())
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

  onCancel = () => {
    this.props.router.goBack();
  };

}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 32,
    paddingRight: 32,
  },
  buttonsHolder: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 32,
  },
};

export default adminOnly(withRouter(NewSource));