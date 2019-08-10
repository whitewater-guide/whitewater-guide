import Divider from '@material-ui/core/Divider';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Coordinate3d } from '@whitewater-guide/commons';
import { FieldArray, FieldArrayRenderProps } from 'formik';
import React, { useCallback } from 'react';
import { CoordinateInput } from '../../components';
import CoordinateArrayHeader from './CoordinateArrayHeader';
import CoordinateField from './CoordinateField';

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    container: {
      marginTop: spacing(1),
      height: '100%',
      overflowX: 'hidden',
    },
  }),
);

interface Props {
  name: string;
}

const CoordinateArrayInner: React.FC<FieldArrayRenderProps> = React.memo(
  (props) => {
    const { form, name, push, remove } = props;
    const coordinates: Coordinate3d[] = props.form.values[props.name];
    const classes = useStyles();

    const onReverse = useCallback(() => {
      form.setFieldValue(name, coordinates.reverse());
    }, [form.setFieldValue, name, coordinates]);

    return (
      <div className={classes.container}>
        <CoordinateArrayHeader value={coordinates} onReverse={onReverse} />
        <Divider />

        {coordinates.map((_, i) => (
          <CoordinateField
            key={i}
            name={`${name}.${i}`}
            index={i}
            onRemove={remove}
          />
        ))}
        <CoordinateInput
          isNew={true}
          key={`new${coordinates.length}`}
          onAdd={push}
        />
      </div>
    );
  },
);

CoordinateArrayInner.displayName = 'CoordinateArrayInner';

export const CoordinateArray: React.FC<Props> = React.memo(({ name }) => {
  return (
    <FieldArray name={name}>
      {(helpers) => <CoordinateArrayInner {...helpers} />}
    </FieldArray>
  );
});

CoordinateArray.displayName = 'CoordinateArray';
