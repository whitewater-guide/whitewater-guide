import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import {
  renderDifficulty,
  sectionName,
  stringifySeason,
  useMapSelection,
} from '@whitewater-guide/clients';
import { Durations } from '@whitewater-guide/schema';
import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router';

import { Title } from '../../layout/details';
import { paths } from '../../utils';
import { InfoWindow } from './InfoWindow';
import { MapElementProps } from './types';
import { isSection } from './utils';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      overflow: 'hidden',
    },
  }),
);

const SelectedSectionWeb: React.FC<MapElementProps> = (props) => {
  const [selection, onSelected] = useMapSelection();
  const history = useHistory();
  const match = useRouteMatch<{ regionId: string }>();
  const classes = useStyles();

  const onDetails = useCallback(() => {
    if (isSection(selection)) {
      history.push(
        paths.to({
          regionId: match.params.regionId,
          sectionId: selection.id,
        }),
      );
    }
  }, [selection, history, match]);

  const onClose = useCallback(() => onSelected(null), [onSelected]);

  if (!isSection(selection)) {
    return null;
  }
  const { putIn } = selection;
  const putInLL = { lat: putIn.coordinates[1], lng: putIn.coordinates[0] };

  return (
    <InfoWindow position={putInLL} onCloseClick={onClose} {...props}>
      <Grid container spacing={1} className={classes.root}>
        <Grid container item xs={12}>
          <Grid item xs={9}>
            <Typography variant="h5">{sectionName(selection)}</Typography>
            <Rating precision={0.5} value={selection.rating} readOnly />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h5" align="right">
              {renderDifficulty(selection)}
            </Typography>
          </Grid>
        </Grid>

        <Grid container item xs={12}>
          <Grid item xs={2}>
            <b>Drop</b>
          </Grid>
          <Grid item xs={2}>{`${selection.drop} m`}</Grid>
          <Grid item xs={2}>
            <b>Length</b>
          </Grid>
          <Grid item xs={2}>{`${selection.distance} km`}</Grid>
          <Grid item xs={2}>
            <b>Duration</b>
          </Grid>
          <Grid item xs={2}>
            {selection.duration && Durations.get(selection.duration)}
          </Grid>
        </Grid>

        <Grid container item xs={12}>
          <Title>Season</Title>
          <Grid>
            <div>{selection.season}</div>
            <div>{stringifySeason(selection.seasonNumeric)}</div>
          </Grid>
        </Grid>

        <Grid container item xs={12}>
          <Button
            fullWidth
            variant="contained"
            onClick={onDetails}
            color="primary"
          >
            More
          </Button>
        </Grid>
      </Grid>
    </InfoWindow>
  );
};

export default SelectedSectionWeb;
