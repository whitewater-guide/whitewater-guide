import Coordinates from 'coordinate-parser';
import { isEmpty } from 'lodash';
import IconButton from 'material-ui/IconButton';
import React from 'react';
import { BaseFieldProps, Field, FieldsProps, GenericField, WrappedFieldProps } from 'redux-form';
import { Styles } from '../../styles';
import { CoordinateSchema } from '../../ww-commons/features/points';
import { NumberInput } from '../NumberInput';
import { validateInput } from './validateInput';

/* tslint:disable:max-classes-per-file */

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    width: 85,
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
  icon: {
    padding: 0,
  },
};

type Unnumber = undefined | number;
type Uncoordinate = [Unnumber, Unnumber, Unnumber];

interface LatLonAltInputProps {
  value?: Uncoordinate;
  onChange?: (val: Uncoordinate) => void;
  onAdd?: (val: Uncoordinate) => void;
  onRemove?: () => void;
  isNew?: boolean;
}

interface LatLonAltInputState {
  errors: any;
  value: Uncoordinate;
  submitted?: boolean;
}

const validator = validateInput(CoordinateSchema);

export class LatLonAltInput extends React.PureComponent<LatLonAltInputProps, LatLonAltInputState> {

  constructor(props: LatLonAltInputProps) {
    super(props);
    this.state = {
      errors:  {},
      value: props.value || [undefined, undefined, undefined],
      submitted: false,
    };
  }

  componentWillReceiveProps(next: LatLonAltInputProps) {
    const val = next.value || [undefined, undefined, undefined];
    const errors = validator(val);
    this.setState({ value: val, errors, submitted: false });
  }

  onAdd = () => {
    this.setState({ submitted: true });
    if (this.props.onAdd && isEmpty(this.state.errors)) {
      this.props.onAdd(this.state.value);
    }
  };

  // tslint:disable-next-line:member-ordering
  onChange: Array<(value: number | undefined) => void> = [0, 1, 2].map(index => (coord: Unnumber) => {
    const { onChange }  = this.props;
    const { value }  = this.state;
    const newValue = Object.assign(value.slice() as Uncoordinate, { [index]: coord });
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
      const coordinateStr = (e.nativeEvent as any).clipboardData.getData('Text');
      const coord = new Coordinates(coordinateStr);
      const lat = coord.getLatitude();
      const lng = coord.getLongitude();
      const value: Uncoordinate = [lng, lat, 0];
      const errors = validator(value);
      this.setState({ value, errors });
      e.preventDefault();
    } catch (e) {}
  };

  render() {
    const { errors, value, submitted } = this.state;
    const { isNew, onRemove } = this.props;
    const btnDisabled = isNew ? (submitted && !isEmpty(errors)) : false;
    const showErrors = isNew ? submitted : true;
    return (
      <div style={styles.container}>
        <NumberInput
          onPaste={this.onPaste}
          style={styles.input}
          hintText="Latitude"
          value={value[1]}
          onChange={this.onChange[1]}
          errorText={(errors[1] && showErrors) ? '*' : undefined}
        />
        <NumberInput
          style={styles.input}
          hintText="Longitude"
          value={value[0]}
          onChange={this.onChange[0]}
          errorText={(errors[0] && showErrors) ? '*' : undefined}
        />
        <NumberInput
          style={styles.altitude}
          hintText="Alt"
          value={value[2]}
          onChange={this.onChange[2]}
          errorText={(errors[2] && showErrors) ? '*' : undefined}
        />
        <IconButton
          iconStyle={styles.icon}
          style={styles.button}
          disabled={btnDisabled}
          iconClassName="material-icons"
          onClick={isNew ? this.onAdd : onRemove}
        >
          {isNew ? 'add_circle' : 'remove_circle'}
        </IconButton>
      </div>
    );
  }
}

type CompProps = WrappedFieldProps & LatLonAltInputProps;

const LatLonAltComponent: React.StatelessComponent<CompProps> = ({ input, meta, ...own }) => (
  <LatLonAltInput
    {...own}
    value={input.value}
    onChange={input.onChange}
  />
);

type FieldProps = BaseFieldProps<LatLonAltInputProps> & LatLonAltInputProps;

export const LatLonAltField: React.StatelessComponent<FieldProps> = props => {
  const CustomField = Field as new () => GenericField<LatLonAltInputProps>;
  return (
    <CustomField {...props} component={LatLonAltComponent} />
  );
};

interface LLAArrayFieldProps {
  name: string;
  index?: number;
  fields?: FieldsProps<Uncoordinate>;
}

export class LLAArrayField extends React.PureComponent<LLAArrayFieldProps> {
  onRemove = () => this.props.fields!.remove(this.props.index!);

  render() {
    const { name } = this.props;
    return (
      <LatLonAltField name={name} onRemove={this.onRemove} />
    );
  }
}
