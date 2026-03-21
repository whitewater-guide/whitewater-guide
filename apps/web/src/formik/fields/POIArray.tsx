import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import type { PointInput } from '@whitewater-guide/schema';
import type { FieldArrayRenderProps } from 'formik';
import { FieldArray } from 'formik';
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
  mapBounds: CodegenCoordinates[] | null;
}

const POIArrayInner = React.memo<FieldArrayRenderProps & Props>((props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { name, form, mapBounds, remove } = props;
  const classes = useStyles();
  const values: PointInput[] = form.values[name];
  return (
    <>
      {values.map((_poi, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Paper key={index} className={classes.paper} elevation={2}>
          <POIField
            name={`${name}.${index}`}
            index={index}
            mapBounds={mapBounds}
            onRemove={remove}
          />
        </Paper>
      ))}
    </>
  );
});

POIArrayInner.displayName = 'POIArrayInner';

const POIArrayAddButton = React.memo<FieldArrayRenderProps>(({ push }) => {
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
    <Button variant="contained" fullWidth onClick={onAdd}>
      <Icon>add</Icon>
      Add
    </Button>
  );
});

POIArrayAddButton.displayName = 'POIArrayAddButton';

export const POIArray = React.memo<Props>((props) => {
  const { name, mapBounds } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <FieldArray name={name}>
        {(arrayHelpers) => (
          <>
            <POIArrayInner
              {...arrayHelpers}
              mapBounds={mapBounds}
              name={name}
            />
            <POIArrayAddButton {...arrayHelpers} />
          </>
        )}
      </FieldArray>
    </div>
  );
});

POIArray.displayName = 'POIArray';
