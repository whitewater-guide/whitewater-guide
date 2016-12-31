import React, {Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {POITypes} from '../../api/points';
import _ from 'lodash';

class CoordinatesGroup extends Component {
  static propTypes = {
    title: PropTypes.string,
    detailed: PropTypes.bool,
    field: PropTypes.shape({
      value: PropTypes.any,
      error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      onChange: PropTypes.func,
    }),
  };

  static defaultProps = {
    detailed: false,
  };

  render() {
    let value = _.get(this, 'props.field.value', {});
    let errorString = '';//Global field error (for example, coordinate field is required), not rendered for now
    let errors = {};
    if (_.isString(this.props.field.error))
      errorString = this.props.field.error;
    else
      errors = this.props.field.error;
    return (
      <div style={styles.container}>
        {this.props.title && <h3>{this.props.title}</h3>}
        { this.props.detailed &&
        <div style={styles.row}>
          <TextField
            fullWidth={true}
            errorText={_.get(errors, 'name')}
            value={_.get(value, 'name')}
            onChange={this.onNameChange}
            hintText="Name"
            floatingLabelText="Name"
          />
          <SelectField
            value={_.get(value, 'kind')}
            onChange={this.onKindChange}
            errorText={_.get(errors, 'kind')}
            floatingLabelText="Type"
          >
            {POITypes.map(this.renderPointKind)}
          </SelectField>
        </div>
        }
        { this.props.detailed &&
        <TextField
          fullWidth={true}
          errorText={_.get(errors, 'description')}
          value={_.get(value, 'description')}
          onChange={this.onDescriptionChange}
          hintText="Description"
          multiLine={true}
          floatingLabelText="Description"
        />
        }

        <div style={styles.row}>
          <div style={styles.col}>
            <TextField
              style={styles.textInput}
              type="number"
              errorText={_.get(errors, 'coordinates.1')}
              value={_.get(value, 'coordinates.1')}
              onChange={this.onLatitudeChange}
              hintText="Latitude"
              floatingLabelText="Latitude"
            />
          </div>
          <div style={styles.col}>
            <TextField
              style={styles.textInput}
              type="number"
              errorText={_.get(errors, 'coordinates.0')}
              value={_.get(value, 'coordinates.0')}
              onChange={this.onLongitudeChange}
              hintText="Longitude"
              floatingLabelText="Longitude"
            />
          </div>
          <div style={styles.col}>
            <TextField
              style={styles.textInput}
              type="number"
              errorText={_.get(errors, 'altitude')}
              value={value.altitude}
              onChange={this.onAltitudeChange}
              hintText="Altitude"
              floatingLabelText="Altitude"
            />
          </div>
        </div>
      </div>
    );
  }

  renderPointKind = (item) => {
    return (
      <MenuItem key={item} value={item} primaryText={item} />
    );
  };

  onKindChange = (event, index, kind) => {
    let {field: {value}} = this.props;
    this.onChange({...value, kind});
  };

  onNameChange = (e, name) => {
    let {field: {value}} = this.props;
    this.onChange({...value, name});
  };

  onDescriptionChange = (e, description) => {
    let {field: {value}} = this.props;
    this.onChange({...value, description});
  };

  onAltitudeChange = (e, altitude) => {
    let {field: {value}} = this.props;
    this.onChange({...value, altitude});
  };

  onLongitudeChange = (e, longitude) => {
    let {field: {value}} = this.props;
    this.onChange({...value, coordinates: [longitude, _.get(value, 'coordinates.1')]});
  };

  onLatitudeChange = (e, latitude) => {
    let {field: {value}} = this.props;
    this.onChange({...value, coordinates: [_.get(value, 'coordinates.0'), latitude]});
  };

  onChange = (value) => {
    const emptyInput = v => v === undefined || v === '';
    if (
      !this.props.detailed &&
      emptyInput(value.altitude) &&
      emptyInput(_.get(value, 'coordinates.0')) &&
      emptyInput(_.get(value, 'coordinates.1'))
    ) {
      this.props.field.onChange(undefined);
    }
    else {
      this.props.field.onChange(value);
    }
  };

}

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    minWidth: 360,
  },
  row: {
    display: 'flex',
  },
  col: {
    display: 'flex',
    flex: 1,
  },
  textInput: {
    width: '100%',
  },
};

export default CoordinatesGroup;