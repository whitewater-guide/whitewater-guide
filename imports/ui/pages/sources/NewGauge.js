import React, {Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {ValidationError} from 'meteor/mdg:validation-error';

export default class NewGauge extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  state = {
    name: '',
    code: '',
    altitide: '',
    latitude: '',
    longitude: '',
    unit: '',
    measurement: '',
    requestParams: '',
    url: '',
    disabled: false,
  };

  render() {
    const actions = [
    ];
    return (
      <div>
        <h3>New gauge</h3>
        <TextField value={this.state.name} onChange={(e,name) => this.setState({name})} hintText="Name" floatingLabelText="Name"/>
        <TextField value={this.state.code} onChange={(e,code) => this.setState({code})} hintText="Code" floatingLabelText="Code"/>
        <TextField value={this.state.url} onChange={(e,url) => this.setState({url})} hintText="URL" floatingLabelText="URL"/>
        <TextField value={this.state.altitude} onChange={(e,altitude) => this.setState({altitude})} hintText="Altitude" floatingLabelText="Altitude"/>
        <TextField value={this.state.latitude} onChange={(e,latitude) => this.setState({latitude})} hintText="Latitude" floatingLabelText="Latitude"/>
        <TextField value={this.state.longitude} onChange={(e,longitude) => this.setState({longitude})} hintText="Longitude" floatingLabelText="Longitude"/>
        <TextField value={this.state.measurement} onChange={(e,measurement) => this.setState({measurement})} hintText="Measurement" floatingLabelText="Measurement"/>
        <TextField value={this.state.unit} onChange={(e,unit) => this.setState({unit})} hintText="Unit" floatingLabelText="Unit"/>
        <div>
          <FlatButton label="Cancel" primary={true} onMouseUp={this.props.onClose} onTouchEnd={this.props.onClose}/>
          <FlatButton label="Add" primary={true} onMouseUp={this.props.onSubmit} onTouchEnd={this.props.onSubmit}/>
        </div>
      </div>
    );
  }
}