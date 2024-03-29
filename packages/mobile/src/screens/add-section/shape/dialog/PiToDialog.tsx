import { Formik } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { Portal } from 'react-native-paper';

import type { Shape } from '../../types';
import type { PiToState } from '../usePiToState';
import PiToDialogContent from './PiToDialogContent';
import { schema } from './validation';

interface Props {
  initialShape: PiToState['shape'];
  setShape: (shape: [CodegenCoordinates, CodegenCoordinates]) => void;
  onDismiss: () => void;
}

export const PiToDialog: React.FC<Props> = (props) => {
  const { initialShape, setShape, onDismiss } = props;
  const initialValues = useMemo(
    () => ({
      shape: initialShape,
    }),
    [initialShape],
  );
  const onSubmit = useCallback(
    (values: Shape) => {
      setShape(schema.cast(values).shape as any);
      onDismiss();
    },
    [setShape, onDismiss],
  );
  return (
    <Portal>
      <Formik<Shape>
        initialValues={initialValues}
        validateOnMount
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        {(formikProps) => (
          <PiToDialogContent {...formikProps} onDismiss={onDismiss} />
        )}
      </Formik>
    </Portal>
  );
};

PiToDialog.displayName = 'PiToDialog';
