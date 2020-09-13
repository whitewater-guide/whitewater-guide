import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { storiesOf } from '@storybook/react';
import { Formik } from 'formik';
import React, { useCallback, useMemo } from 'react';

import { NumberField } from './NumberField';

interface StoryProps {
  initialValue: number | null;
}

interface Shape {
  value: number | null;
}

const Story: React.FC<StoryProps> = ({ initialValue, children }) => {
  const onSubmit = useCallback((v: Shape) => {
    // eslint-disable-next-line no-console
    console.log(v.value, typeof v.value);
  }, []);
  const initialValues: Shape = useMemo(
    () => ({
      value: initialValue,
    }),
    [],
  );
  return (
    <Grid container={true} spacing={1}>
      <Formik<Shape> onSubmit={onSubmit} initialValues={initialValues}>
        {({ submitForm }) => (
          <React.Fragment>
            <Grid item={true} xs={4}>
              {children}
            </Grid>
            <Grid item={true} xs={2}>
              <Button onClick={submitForm}>Submit</Button>
            </Grid>
          </React.Fragment>
        )}
      </Formik>
    </Grid>
  );
};

storiesOf('Numeric field', module)
  .addDecorator((story) => <div>{story()}</div>)
  .add('Init with number', () => {
    return (
      <Story initialValue={100}>
        <NumberField
          fullWidth={true}
          name="value"
          label="Value"
          placeholder="Value"
        />
      </Story>
    );
  })
  .add('Init with null', () => {
    return (
      <Story initialValue={null}>
        <NumberField
          fullWidth={true}
          name="value"
          label="Value"
          placeholder="Value"
        />
      </Story>
    );
  });
