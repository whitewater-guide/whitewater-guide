import IconButton from 'material-ui/IconButton';
import * as React from 'react';
import { BaseFieldProps, Field, FieldsProps, GenericField, WrappedFieldProps } from 'redux-form';
import { Styles } from '../../styles';
import { NumberInput } from '../NumberInput';

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
    marginTop: 24,
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
  onAdd?: () => void;
  onRemove?: () => void;
  isNew?: boolean;
}

export class LatLonAltInput extends React.PureComponent<LatLonAltInputProps> {

  onChange = [0, 1, 2].map(index => (coord: Unnumber) => {
    const { value = [undefined, undefined, undefined], onChange }  = this.props;
    if (onChange) {
      onChange(Object.assign(value.slice() as Uncoordinate, { [index]: coord }));
    }
  });

  render() {
    const { value = [undefined, undefined, undefined], isNew, onAdd, onRemove } = this.props;
    return (
      <div style={styles.container}>
        <NumberInput style={styles.input} hintText="Latitude" value={value[1]} onChange={this.onChange[1]} />
        <NumberInput style={styles.input} hintText="Longitude" value={value[0]} onChange={this.onChange[0]} />
        <NumberInput style={styles.altitude} hintText="Alt" value={value[2]} onChange={this.onChange[2]} />
        <IconButton
          iconStyle={styles.icon}
          style={styles.button}
          disabled={false}
          iconClassName="material-icons"
          onClick={isNew ? onAdd : onRemove}
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
