import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useMapSelection } from '@whitewater-guide/clients';
import { isPoint } from '@whitewater-guide/commons';
import React, { useCallback } from 'react';
import { InfoWindow } from './InfoWindow';
import { MapElementProps } from './types';

const SelectedPOIWeb: React.FC<MapElementProps> = (props) => {
  const { selection, onSelected } = useMapSelection();
  const onClose = useCallback(() => onSelected(null), [onSelected]);

  if (!isPoint(selection)) {
    return null;
  }
  const position = {
    lat: selection.coordinates[1],
    lng: selection.coordinates[0],
  };
  return (
    <InfoWindow position={position} onCloseClick={onClose} {...props}>
      <Grid container={true} style={{ minWidth: 500 }}>
        <Grid>
          <Typography variant="h5">{selection.name}</Typography>
        </Grid>
        <Grid>
          <p>{selection.description}</p>
        </Grid>
      </Grid>
    </InfoWindow>
  );
};

export default SelectedPOIWeb;
