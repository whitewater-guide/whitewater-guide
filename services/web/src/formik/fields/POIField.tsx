import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  CoordinateLoose,
  NamedNode,
  POINames,
} from '@whitewater-guide/commons';
import map from 'lodash/map';
import React, { useCallback, useState } from 'react';
import { IconButtonWithData } from '../../components';
import { NumberField } from './NumberField';
import { SelectField, SelectFieldPresets } from './select';
import { SelectPointDialogField } from './SelectPointDialogField';
import { TextField } from './TextField';

const useStyles = makeStyles((theme) =>
  createStyles({
    centered: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  }),
);

const POI_OPTIONS: NamedNode[] = map(POINames, (name, id) => ({
  name,
  id,
}));

interface Props {
  name: string;
  index?: number;
  title?: string;
  detailed?: boolean;
  mapDialog?: boolean;
  mapBounds: CoordinateLoose[] | null;
  onRemove?: (index?: number) => void;
}

export const POIField: React.FC<Props> = (props) => {
  const {
    name,
    title,
    detailed = true,
    mapDialog = true,
    index,
    onRemove,
    mapBounds,
  } = props;
  const prefix = title ? `${title} ` : '';
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  const openMap = useCallback(() => setDialogOpen(true), [setDialogOpen]);
  const closeMap = useCallback(() => setDialogOpen(false), [setDialogOpen]);

  return (
    <Grid container={true}>
      {detailed && (
        <Grid item={true} container={true} xs={12} spacing={1}>
          <Grid item={true} xs={7}>
            <TextField
              fullWidth={true}
              name={`${name}.name`}
              placeholder="Name"
            />
          </Grid>
          <Grid item={true} xs={4}>
            <SelectField
              {...SelectFieldPresets.NamedNodeId}
              fullWidth={true}
              name={`${name}.kind`}
              placeholder="Type"
              options={POI_OPTIONS}
            />
          </Grid>
          <Grid item={true} xs={1} className={classes.centered}>
            <IconButtonWithData data={index} onPress={onRemove} icon="delete" />
          </Grid>
        </Grid>
      )}
      {detailed && (
        <Grid item={true} xs={12}>
          <TextField
            fullWidth={true}
            multiline={true}
            name={`${name}.description`}
            placeholder="Description"
          />
        </Grid>
      )}

      <Grid item={true} container={true} xs={12} spacing={1}>
        <Grid item={true} xs={4}>
          <NumberField
            fullWidth={true}
            name={`${name}.coordinates[1]`}
            label={`${prefix}Latitude`}
            placeholder={`${prefix}Latitude`}
          />
        </Grid>
        <Grid item={true} xs={4}>
          <NumberField
            fullWidth={true}
            name={`${name}.coordinates[0]`}
            label={`${prefix}Longitude`}
            placeholder={`${prefix}Longitude`}
          />
        </Grid>
        <Grid item={true} xs={3}>
          <NumberField
            fullWidth={true}
            name={`${name}.coordinates[2]`}
            label={`${prefix}Altitude`}
            placeholder={`${prefix}Altitude`}
          />
        </Grid>
        {mapDialog && (
          <Grid item={true} xs={1} className={classes.centered}>
            <IconButton onClick={openMap}>
              <Icon>add_location</Icon>
            </IconButton>
          </Grid>
        )}
      </Grid>
      {dialogOpen && (
        <SelectPointDialogField
          name={`${name}.coordinates`}
          onClose={closeMap}
          bounds={mapBounds}
        />
      )}
    </Grid>
  );
};
