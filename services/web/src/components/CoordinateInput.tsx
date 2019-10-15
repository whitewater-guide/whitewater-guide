import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import {
  Coordinate3d,
  CoordinateSchema,
  createSafeValidator,
} from '@whitewater-guide/commons';
import clipboard from 'clipboard-copy';
import Coordinates from 'coordinate-parser';
import isEmpty from 'lodash/isEmpty';
import round from 'lodash/round';
import React from 'react';
import { Styles } from '../styles';
import { NumberInput } from './NumberInput';

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    width: 75,
    marginRight: 4,
  },
  altitude: {
    width: 40,
  },
  button: {
    paddingLeft: 4,
    paddingRight: 4,
    width: undefined,
    height: undefined,
  },
  iconsWrapper: {
    width: 64,
  },
};

const validator = createSafeValidator(CoordinateSchema);

type Unnumber = undefined | number;
type Uncoordinate = [Unnumber, Unnumber, Unnumber];

export interface CoordinateInputProps {
  showCopy?: boolean;
  value?: Uncoordinate;
  onChange?: (val: Uncoordinate) => void;
  onAdd?: (val: Coordinate3d) => void;
  onRemove?: () => void;
  isNew?: boolean;
}

interface State {
  errors: Record<any, any> | null;
  value: Uncoordinate;
  submitted?: boolean;
}

export class CoordinateInput extends React.PureComponent<
  CoordinateInputProps,
  State
> {
  constructor(props: CoordinateInputProps) {
    super(props);
    this.state = {
      errors: {},
      value: props.value || [undefined, undefined, undefined],
      submitted: false,
    };
  }

  componentWillReceiveProps(next: CoordinateInputProps) {
    const val = next.value || [undefined, undefined, undefined];
    const errors = validator(val);
    this.setState({ value: val, errors, submitted: false });
  }

  onAdd = () => {
    this.setState({ submitted: true });
    if (this.props.onAdd && isEmpty(this.state.errors)) {
      const [lng, lat, alt = 0] = this.state.value;
      // All three are defined, because errors are empty
      this.props.onAdd([lng!, lat!, alt]);
    }
  };

  // tslint:disable-next-line:member-ordering
  onChange: Array<(v: number) => void> = [0, 1, 2].map((index) => (v) => {
    const { onChange } = this.props;
    const { value } = this.state;
    const newValue = Object.assign(value.slice() as Uncoordinate, {
      [index]: v,
    });
    const errors = validator(newValue);
    this.setState({ value: newValue, errors });
    // Do not fire onChange with bad coordinate, otherwise GoogleMaps break
    if (onChange && isEmpty(errors)) {
      onChange(newValue);
    }
  });

  onPaste = (e: React.SyntheticEvent<any>) => {
    if (!this.props.isNew) {
      return;
    }
    try {
      const coordinateStr = (e.nativeEvent as any).clipboardData.getData(
        'Text',
      );
      const coord = new Coordinates(coordinateStr);
      const lat = round(coord.getLatitude(), 4);
      const lng = round(coord.getLongitude(), 4);
      const value: Uncoordinate = [lng, lat, 0];
      const errors = validator(value);
      this.setState({ value, errors });
      e.preventDefault();
    } catch (err) {}
  };

  onCopy = () => {
    const [lng, lat] = this.props.value || [];
    if (lng !== undefined && lat !== undefined) {
      clipboard(`${lat.toFixed(4)},${lng.toFixed(4)}`).catch(() => {});
    }
  };

  render() {
    const { errors, value, submitted } = this.state;
    const { isNew, showCopy, onRemove } = this.props;
    const btnDisabled = isNew ? submitted && !isEmpty(errors) : false;
    const showErrors = isNew ? submitted : true;
    return (
      <div style={styles.container}>
        <NumberInput
          onPaste={this.onPaste}
          style={styles.input}
          placeholder="Latitude"
          value={value[1] === undefined ? null : value[1]}
          onChange={this.onChange[1]}
          margin="dense"
          error={!!errors && !!errors[1] && showErrors}
        />
        <NumberInput
          style={styles.input}
          placeholder="Longitude"
          value={value[0] === undefined ? null : value[0]}
          onChange={this.onChange[0]}
          margin="dense"
          error={!!errors && !!errors[0] && showErrors}
        />
        <NumberInput
          style={styles.altitude}
          placeholder="Alt"
          value={value[2] === undefined ? null : value[2]}
          onChange={this.onChange[2]}
          margin="dense"
          error={!!errors && !!errors[2] && showErrors}
        />
        <div style={styles.iconsWrapper}>
          <IconButton
            size="small"
            disabled={btnDisabled}
            onClick={isNew ? this.onAdd : onRemove}
          >
            <Icon>{isNew ? 'add_circle' : 'remove_circle'}</Icon>
          </IconButton>
          {showCopy && (
            <IconButton size="small" onClick={this.onCopy}>
              <Icon>{'file_copy'}</Icon>
            </IconButton>
          )}
        </div>
      </div>
    );
  }
}
