import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {ValidationError} from 'meteor/mdg:validation-error';

import {createSource} from '../../../api/sources';

export default class NewSource extends Component {
  state = {
    name: '',
    url: '',
    code: '',
    interval: 60,
    harvestMode: "allAtOnce",
    errors: {},
  };

  render() {
    return (
      <Paper style={styles.paper} zDepth={2}>
      
        <h1>New Source</h1>
        
        <TextField value={this.state.name} onChange={(e,name) => this.setState({name})} hintText="Name" floatingLabelText="Name"/>
        <br />
        
        <TextField value={this.state.url} onChange={(e,url) => this.setState({url})}  hintText="URL" floatingLabelText="URL"/>
        <br />
        
        <TextField value={this.state.code} onChange={(e,code) => this.setState({code})}  hintText="Script name" floatingLabelText="Script name"/>
        <br />

        <div style={{height: 72}}>
          <span>Harvest mode</span>
          <DropDownMenu value={this.state.harvestMode} onChange={this.handleChange}>
            <MenuItem value="allAtOnce" primaryText="All at once" />
            <MenuItem value="oneByOne" primaryText="One by one" />
          </DropDownMenu>
          <br/>
        </div>

        <TextField value={this.state.interval} onChange={(e,interval) => this.setState({interval})} 
                   hintText="Interval" floatingLabelText="Interval"
                   type="number"/>
        <br />
        <br />

        <RaisedButton label="Add" primary={true} fullWidth={true} onMouseUp={this.onCreate} onTouchEnd={this.onCreate}/>
      </Paper>
    );
  }

  handleChange = (event, index, harvestMode) => this.setState({harvestMode});

  onCreate = () => {
    console.log('On create');
    createSource.callPromise(this.state)
      .then(result => console.log('Suceess', result))
      .catch(err => {
        if (ValidationError.is(err)){

        }
      });
  };
}

const styles = {
  paper: {
    width: 600,
    margin: '16px auto',
    padding: 16,
  },
}