import IconButton from 'material-ui/IconButton';
import { red500 } from 'material-ui/styles/colors';
import * as React from 'react';
import { BaseFieldProps, Field, FieldsProps, GenericField, WrappedFieldProps } from 'redux-form';
import { Styles } from '../../styles';
import { CoordinateSchema } from '../../ww-commons/features/points';
import { NumberInput } from '../NumberInput';
import { validateInput } from './validateInput';
import { isEmpty } from 'lodash';

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
}

const validator = validateInput(CoordinateSchema);

export class LatLonAltInput extends React.PureComponent<LatLonAltInputProps, LatLonAltInputState> {

  constructor(props: LatLonAltInputProps) {
    super(props);
    this.state = { errors:  {}, value: props.value || [undefined, undefined, undefined] };
  };

  componentWillReceiveProps(next: LatLonAltInputProps) {
    const val = next.value || [undefined, undefined, undefined];
    const errors = validator(val);
    this.setState({ value: val, errors });
  }

  onAdd = () => {
    if (this.props.onAdd) {
      this.props.onAdd(this.state.value);
    }
  };

  onChange = [0, 1, 2].map(index => (coord: Unnumber) => {
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

  render() {
    const { errors, value } = this.state;
    const { isNew, onAdd, onRemove } = this.props;
    return (
      <div style={styles.container}>
        <NumberInput
          style={styles.input}
          hintText="Latitude"
          value={value[1]}
          onChange={this.onChange[1]}
          errorText={errors[1] ? '*' : undefined}
        />
        <NumberInput
          style={styles.input}
          hintText="Longitude"
          value={value[0]}
          onChange={this.onChange[0]}
          errorText={errors[0] ? '*' : undefined}
        />
        <NumberInput
          style={styles.altitude}
          hintText="Alt"
          value={value[2]}
          onChange={this.onChange[2]}
          errorText={errors[2] ? '*' : undefined}
        />
        <IconButton
          iconStyle={styles.icon}
          style={styles.button}
          disabled={!isEmpty(errors)}
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