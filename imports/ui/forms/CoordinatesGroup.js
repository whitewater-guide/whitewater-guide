import React, {Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';

class CoordinatesGroup extends Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    field: PropTypes.shape({
      value: PropTypes.any,
      error: PropTypes.string,
      onChange: PropTypes.func,
    }),
  };

  render() {
    let value = this.props.field.value;
    if (value === undefined)
      value = {altitude: '', coordinates: ['', '']};
    return (
      <div style={styles.container}>
        {this.props.title && <h3>{this.props.title}</h3>}
        <div style={styles.row}>
          <div style={styles.col}>
            <TextField
              style={styles.textInput}
              type="number"
              value={value.coordinates[1]}
              onChange={this.onLatitudeChange}
              hintText="Latitude"
              floatingLabelText="Latitude"
            />
          </div>
          <div style={styles.col}>
            <TextField
              style={styles.textInput}
              type="number"
              value={value.coordinates[0]}
              onChange={this.onLongitudeChange}
              hintText="Longitude"
              floatingLabelText="Longitude"
            />
          </div>
          <div style={styles.col}>
            <TextField
              style={styles.textInput}
              type="number"
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

  onAltitudeChange = (e, altitude) => {
    const {field: {value, onChange}} = this.props;
    onChange({...value, altitude});
  };

  onLongitudeChange = (e, longitude) => {
    const {field: {value, onChange}} = this.props;
    onChange({ ...value, coordinates: [longitude, value.coordinates[1]] });
  };

  onLatitudeChange = (e, latitude) => {
    const {field: {value, onChange}} = this.props;
    onChange({ ...value, coordinates: [value.coordinates[0], latitude] });
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