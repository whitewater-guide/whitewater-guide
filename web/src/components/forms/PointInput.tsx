import { map } from 'lodash';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import { grey100 } from 'material-ui/styles/colors';
import * as React from 'react';
import { FieldsProps } from 'redux-form';
import { Styles } from '../../styles';
import { Coordinate, NamedResource, POINames, Point, PointInput as PointInputType } from '../../ww-commons';
import { Select } from './Select';
import SelectPointDialog from './SelectPointDialog';
import { TextInput } from './TextInput';

const POI_OPTIONS: NamedResource[] = map(POINames, (name, id) => ({ name, id }));

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: 4,
    marginTop: 8,
    marginBottom: 8,
    padding: 4,
    minWidth: 360,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    width: 48,
    minWidth: 48,
  },
};

interface Props {
  name: string;
  index?: number;
  fields?: FieldsProps<PointInputType>;
  title?: string;
  detailed?: boolean;
  mapDialog?: boolean;
  mapBounds: Coordinate[] | null;
}

interface State {
  dialogOpen: boolean;
}

export class PointInput extends React.PureComponent<Props, State> {
  state: State = {
    dialogOpen: false,
  };

  openMap = () => this.setState({ dialogOpen: true });

  onRemove = () => this.props.fields!.remove(this.props.index!);

  onCloseDialog = () => this.setState({ dialogOpen: false });

  render() {
    const { name, title, detailed = true, mapDialog = true } = this.props;
    const prefix = title ? `${title} ` : '';
    return (
      <Paper style={styles.container}>
        {
          detailed &&
          <div style={styles.row}>
            <TextInput fullWidth name={`${name}.name`} title="Name"/>
            <Select name={`${name}.kind`} title="Type" options={POI_OPTIONS} />
            <IconButton iconClassName="material-icons" onClick={this.onRemove} style={styles.icon}>delete</IconButton>
          </div>
        }
        {
          detailed &&
          <TextInput fullWidth multiLine name={`${name}.description`} title="Description"/>
        }

        <div style={styles.row}>
          <TextInput fullWidth type="number" name={`${name}.coordinates[1]`} title={`${prefix}Latitude`} />
          <TextInput fullWidth type="number" name={`${name}.coordinates[0]`} title={`${prefix}Longitude`} />
          <TextInput fullWidth type="number" name={`${name}.coordinates[2]`} title={`${prefix}Altitude`} />
          {
            mapDialog &&
            <IconButton
              iconClassName="material-icons"
              onClick={this.openMap}
              style={styles.icon}
            >
              add_location
            </IconButton>
          }
        </div>
        {
          this.state.dialogOpen &&
            <SelectPointDialog
              name={`${name}.coordinates`}
              onClose={this.onCloseDialog}
              bounds={this.props.mapBounds}
            />
        }
      </Paper>
    );
  }
}
