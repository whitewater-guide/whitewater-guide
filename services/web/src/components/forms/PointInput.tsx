import {
  Coordinate,
  NamedNode,
  POINames,
  PointInput as PointInputType,
} from '@whitewater-guide/commons';
import map from 'lodash/map';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import React from 'react';
import { FieldArrayFieldsProps } from 'redux-form';
import { Styles } from '../../styles';
import { Select } from './Select';
import SelectPointDialog from './SelectPointDialog';
import { TextInput } from './TextInput';

const POI_OPTIONS: NamedNode[] = map(POINames, (name, id) => ({
  name,
  id,
  language: 'en',
}));

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
  fields?: FieldArrayFieldsProps<PointInputType>;
  title?: string;
  detailed?: boolean;
  mapDialog?: boolean;
  mapBounds: Coordinate[] | null;
  paper?: boolean;
}

interface State {
  dialogOpen: boolean;
}

const Blank: React.StatelessComponent = (({ children }: any) =>
  children) as any;

export class PointInput extends React.PureComponent<Props, State> {
  state: State = {
    dialogOpen: false,
  };

  openMap = () => this.setState({ dialogOpen: true });

  onRemove = () => this.props.fields!.remove(this.props.index!);

  onCloseDialog = () => this.setState({ dialogOpen: false });

  render() {
    const {
      name,
      title,
      detailed = true,
      mapDialog = true,
      paper = true,
    } = this.props;
    const prefix = title ? `${title} ` : '';
    const Wrapper: React.ComponentType<any> = paper ? Paper : Blank;
    return (
      <Wrapper style={styles.container}>
        {detailed && (
          <div style={styles.row}>
            <TextInput fullWidth={true} name={`${name}.name`} title="Name" />
            <Select name={`${name}.kind`} title="Type" options={POI_OPTIONS} />
            <IconButton
              iconClassName="material-icons"
              onClick={this.onRemove}
              style={styles.icon}
            >
              delete
            </IconButton>
          </div>
        )}
        {detailed && (
          <TextInput
            fullWidth={true}
            multiLine={true}
            name={`${name}.description`}
            title="Description"
          />
        )}

        <div style={styles.row}>
          <TextInput
            fullWidth={true}
            type="number"
            name={`${name}.coordinates[1]`}
            title={`${prefix}Latitude`}
          />
          <TextInput
            fullWidth={true}
            type="number"
            name={`${name}.coordinates[0]`}
            title={`${prefix}Longitude`}
          />
          <TextInput
            fullWidth={true}
            type="number"
            name={`${name}.coordinates[2]`}
            title={`${prefix}Altitude`}
          />
          {mapDialog && (
            <IconButton
              iconClassName="material-icons"
              onClick={this.openMap}
              style={styles.icon}
            >
              add_location
            </IconButton>
          )}
        </div>
        {this.state.dialogOpen && (
          <SelectPointDialog
            name={`${name}.coordinates`}
            onClose={this.onCloseDialog}
            bounds={this.props.mapBounds}
          />
        )}
      </Wrapper>
    );
  }
}
