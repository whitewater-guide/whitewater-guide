import Divider from '@material-ui/core/Divider';
import { createStyles, makeStyles } from '@material-ui/core/styles';
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

const CoordinateArrayInner = React.memo<FieldArrayRenderProps>((props) => {
  const { form, name, push, remove } = props;
  const { setFieldValue } = form;
  const coordinates: CodegenCoordinates[] = props.form.values[props.name];
  const lastIndex = coordinates.length - 1;
  const classes = useStyles();

  const onReverse = useCallback(() => {
    setFieldValue(name, coordinates.reverse());
  }, [setFieldValue, name, coordinates]);

  return (
    <div className={classes.container}>
      <CoordinateArrayHeader value={coordinates} onReverse={onReverse} />
      <Divider />

      {coordinates.map((_, i) => (
        <CoordinateField
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          name={`${name}.${i}`}
          index={i}
          onRemove={remove}
          showCopy={i === 0 || i === lastIndex}
        />
      ))}
      <CoordinateInput isNew key={`new${coordinates.length}`} onAdd={push} />
    </div>
  );
});

CoordinateArrayInner.displayName = 'CoordinateArrayInner';

export const CoordinateArray = React.memo<Props>(({ name }) => (
  <FieldArray name={name}>
    {(helpers) => <CoordinateArrayInner {...helpers} />}
  </FieldArray>
));

CoordinateArray.displayName = 'CoordinateArray';
