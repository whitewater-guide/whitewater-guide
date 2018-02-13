import IconButton from 'material-ui/IconButton';
import * as React from 'react';
import { FieldsProps } from 'redux-form';
import { Styles } from '../../styles';
import { Coordinate3d } from '../../ww-commons';
import { TextInput } from './TextInput';

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

interface Props {
  name: string;
  index?: number;
  fields?: FieldsProps<Coordinate3d>;
}

export class LatLonAltInput extends React.PureComponent<Props> {

  onAddOrRemove = () => this.props.fields!.remove(this.props.index!);

  render() {
    const { name } = this.props;
    const isNew = false;
    return (
      <div style={styles.container}>
        <TextInput style={styles.input} type="number" name={`${name}[1]`} title="Latitude" />
        <TextInput style={styles.input} type="number" name={`${name}[0]`} title="Longitude" />
        <TextInput style={styles.altitude} type="number" name={`${name}[2]`} title="Alt" />
        <IconButton
          iconStyle={styles.icon}
          style={styles.button}
          disabled={false}
          iconClassName="material-icons"
          onClick={this.onAddOrRemove}
        >
          {isNew ? 'add_circle' : 'remove_circle'}
        </IconButton>
      </div>
    );
  }
}
