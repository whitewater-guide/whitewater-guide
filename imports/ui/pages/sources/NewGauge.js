import React, {Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {ValidationError} from 'meteor/mdg:validation-error';
import {createGauge} from '../../../api/gauges';
import {withRouter} from 'react-router';

class NewGauge extends Component {
  static propTypes = {
    router: PropTypes.object,
    source: PropTypes.object,
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
    cron: '',
    disabled: false,
  };

  render() {
    return (
      <div style={styles.container}>
        <h3>New gauge</h3>
        <TextField value={this.state.name} onChange={(e,name) => this.setState({name})} hintText="Name" floatingLabelText="Name"/>
        <TextField value={this.state.code} onChange={(e,code) => this.setState({code})} hintText="Code" floatingLabelText="Code"/>
        <TextField value={this.state.url} onChange={(e,url) => this.setState({url})} hintText="URL" floatingLabelText="URL"/>
        <TextField value={this.state.altitude} onChange={(e,altitude) => this.setState({altitude})} hintText="Altitude" floatingLabelText="Altitude"/>
        <TextField value={this.state.latitude} onChange={(e,latitude) => this.setState({latitude})} hintText="Latitude" floatingLabelText="Latitude"/>
        <TextField value={this.state.longitude} onChange={(e,longitude) => this.setState({longitude})} hintText="Longitude" floatingLabelText="Longitude"/>
        <TextField value={this.state.measurement} onChange={(e,measurement) => this.setState({measurement})} hintText="Measurement" floatingLabelText="Measurement"/>
        <TextField value={this.state.unit} onChange={(e,unit) => this.setState({unit})} hintText="Unit" floatingLabelText="Unit"/>
        <TextField value={this.state.cron} onChange={(e,cron) => this.setState({cron})} hintText="Cron expression" floatingLabelText="Cron expression"/>
        <div>
          <FlatButton label="Cancel" primary={true} onMouseUp={this.onClose} onTouchEnd={this.onClose}/>
          <FlatButton label="Add" primary={true} onMouseUp={this.onSubmit} onTouchEnd={this.onSubmit}/>
        </div>
      </div>
    );
  }

  onClose = () => {
    this.props.router.goBack();
  };

  onSubmit = () => {
    createGauge.callPromise({...this.state, source: this.props.source._id})
      .then( result => this.props.router.replace(`/sources/${this.props.source._id}/gauges`))
      .catch( error => console.log('Create gauge error', error));
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
}

export default withRouter(NewGauge);