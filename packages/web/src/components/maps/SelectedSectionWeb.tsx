import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import {
  renderDifficulty,
  stringifySeason,
  useMapSelection,
} from '@whitewater-guide/clients';
import { Durations, isSection, sectionName } from '@whitewater-guide/commons';
import React, { useCallback } from 'react';
import useRouter from 'use-react-router';

import { Title } from '../../layout/details';
import { paths } from '../../utils';
import { InfoWindow } from './InfoWindow';
import { MapElementProps } from './types';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      overflow: 'hidden',
    },
  }),
);

const SelectedSectionWeb: React.FC<MapElementProps> = (props) => {
  const { selection, onSelected } = useMapSelection();
  const { history, match } = useRouter<{ regionId: string }>();
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
  const putIn = selection.putIn;
  const putInLL = { lat: putIn.coordinates[1], lng: putIn.coordinates[0] };

  return (
    <InfoWindow position={putInLL} onCloseClick={onClose} {...props}>
      <Grid container={true} spacing={1} className={classes.root}>
        <Grid container={true} item={true} xs={12}>
          <Grid item={true} xs={9}>
            <Typography variant="h5">{sectionName(selection)}</Typography>
            <Rating precision={0.5} value={selection.rating} readOnly={true} />
          </Grid>
          <Grid item={true} xs={3}>
            <Typography variant="h5" align="right">
              {renderDifficulty(selection)}
            </Typography>
          </Grid>
        </Grid>

        <Grid container={true} item={true} xs={12}>
          <Grid item={true} xs={2}>
            <b>Drop</b>
          </Grid>
          <Grid item={true} xs={2}>{`${selection.drop} m`}</Grid>
          <Grid item={true} xs={2}>
            <b>Length</b>
          </Grid>
          <Grid item={true} xs={2}>{`${selection.distance} km`}</Grid>
          <Grid item={true} xs={2}>
            <b>Duration</b>
          </Grid>
          <Grid item={true} xs={2}>
            {selection.duration && Durations.get(selection.duration)}
          </Grid>
        </Grid>

        <Grid container={true} item={true} xs={12}>
          <Title>Season</Title>
          <Grid>
            <div>{selection.season}</div>
            <div>{stringifySeason(selection.seasonNumeric)}</div>
          </Grid>
        </Grid>

        <Grid container={true} item={true} xs={12}>
          <Button
            fullWidth={true}
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
