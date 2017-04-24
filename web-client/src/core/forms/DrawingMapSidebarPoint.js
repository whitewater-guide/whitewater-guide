import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import _ from 'lodash';
import { TextField } from '../components';
import { isValidLat, isValidLng } from '../../commons/utils/GeoUtils';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    width: 95,
  },
  button: {
    paddingLeft: 4,
    paddingRight: 4,
    width: undefined,
  },
  icon: {
    padding: 0,
  },
};

export default class DrawingMapSidebarPoint extends React.Component {
  static propTypes = {
    point: PropTypes.arrayOf(PropTypes.number),
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    disableRemove: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    point: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      point: props.point ? [...props.point] : ['', ''],
      valid: true,
    };
    this.onLngChange = this.onChange(0);
    this.onLatChange = this.onChange(1);
    this.debounceChange = _.debounce(this.props.onChange, 200);
  }

  componentWillReceiveProps({ point }) {
    if (point) {
      const valid = isValidLat(point[1]) && isValidLng(point[0]);
      this.setState({ valid, point: [...point] });
    } else {
      this.setState({ valid: true, point: ['', ''] });
    }
  }

  onChange = coordIndex => (e, v) => {
    const { point, index } = this.props;
    const newPoint = [
      coordIndex === 0 ? v : this.state.point[0] || '',
      coordIndex === 1 ? v : this.state.point[1] || '',
    ];
    const valid = isValidLat(newPoint[1]) && isValidLng(newPoint[0]);
    this.setState({ point: newPoint, valid });
    if (point && valid) {
      this.debounceChange(index, newPoint);
    }
  };

  onAddOrRemove = () => {
    const { index, onChange } = this.props;
    if (this.props.point) {
      onChange(index, null);
    } else if (this.state.valid) {
      onChange(index, this.state.point);
    }
  };

  render() {
    const { point, valid } = this.state;
    const { disableRemove } = this.props;
    const lat = point ? point[1] : '';
    const lng = point ? point[0] : '';
    const style = valid ? styles.container : { ...styles.container, border: '1px solid red' };
    return (
      <div style={style}>
        <TextField style={styles.input} type="number" hintText="Latitude" value={lat} onChange={this.onLatChange} />
        <TextField style={styles.input} type="number" hintText="Longitude" value={lng} onChange={this.onLngChange} />
        <IconButton
          iconStyle={styles.icon}
          style={styles.button}
          disabled={disableRemove || !valid || (lat === '' && lng === '')}
          iconClassName="material-icons" onTouchTap={this.onAddOrRemove}
        >
          { this.props.point ? 'remove_circle' : 'add_circle' }
        </IconButton>
      </div>
    );
  }
}
