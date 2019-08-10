import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Coordinate, PointInput } from '@whitewater-guide/commons';
import { FieldArray, FieldArrayRenderProps } from 'formik';
import React, { useCallback } from 'react';
import { POIField } from './POIField';

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    root: {
      padding: spacing(3),
    },
    paper: {
      marginBottom: spacing(3),
      padding: spacing(1),
    },
  }),
);

interface Props {
  name: string;
  mapBounds: Coordinate[] | null;
}

const POIArrayInner: React.FC<FieldArrayRenderProps & Props> = React.memo(
  (props) => {
    const { name, form, mapBounds, remove } = props;
    const classes = useStyles();
    const values: PointInput[] = form.values[name];
    return (
      <React.Fragment>
        {values.map((poi, index) => (
          <Paper key={index} className={classes.paper} elevation={2}>
            <POIField
              name={`${name}.${index}`}
              index={index}
              mapBounds={mapBounds}
              onRemove={remove}
            />
          </Paper>
        ))}
      </React.Fragment>
    );
  },
);

POIArrayInner.displayName = 'POIArrayInner';

const POIArrayAddButton: React.FC<FieldArrayRenderProps> = React.memo(
  ({ push }) => {
    const onAdd = useCallback(() => {
      push({
        id: null,
        name: null,
        description: null,
        kind: 'other',
        coordinates: null,
      });
    }, [push]);
    return (
      <Button variant="contained" fullWidth={true} onClick={onAdd}>
        <Icon>add</Icon>
        Add
      </Button>
    );
  },
);

POIArrayAddButton.displayName = 'POIArrayAddButton';

export const POIArray: React.FC<Props> = React.memo((props) => {
  const { name, mapBounds } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <FieldArray name={name}>
        {(arrayHelpers) => {
          return (
            <React.Fragment>
              <POIArrayInner
                {...arrayHelpers}
                mapBounds={mapBounds}
                name={name}
              />
              <POIArrayAddButton {...arrayHelpers} />
            </React.Fragment>
          );
        }}
      </FieldArray>
    </div>
  );
});

POIArray.displayName = 'POIArray';
