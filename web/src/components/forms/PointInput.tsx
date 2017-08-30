import { map } from 'lodash';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import { grey100 } from 'material-ui/styles/colors';
import * as React from 'react';
import { FieldsProps } from 'redux-form';
import { Styles } from '../../styles';
import { Coordinate, POINames, Point } from '../../ww-commons';
import { NamedResource } from '../../ww-commons/core/types';
import { Select } from './Select';
import { TextInput } from './TextInput';

const POI_OPTIONS: NamedResource[] = map(POINames, (name, id) => ({ name, id }));

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: 4,
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
  fields?: FieldsProps<Point>;
  title?: string;
  detailed?: boolean;
  mapDialog?: boolean;
  mapBounds?: Coordinate[];
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

  render() {
    const { name, title, detailed = true, mapDialog } = this.props;
    const prefix = title ? `${title} ` : '';
    // TODO: material-ui v1 should support dense fields
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
          {mapDialog && <IconButton iconClassName="material-icons" onClick={this.openMap}>add_location</IconButton>}
        </div>
        {
          /*
          this.state.dialogOpen &&
          <SelectPointsDialog
            drawingMode="Point"
            bounds={this.props.mapBounds}
            onClose={this.onCloseDialog}
            onSubmit={this.onSubmitDialog}
            points={dialogPoints}
          />
          */
        }
      </Paper>
    );
  }
}
