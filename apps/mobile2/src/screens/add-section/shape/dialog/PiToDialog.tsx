import { Formik } from 'formik';
import { useCallback, useMemo } from 'react';
import { Portal } from 'react-native-paper';

import type { PiToState,Shape  } from '../usePiToState';
import PiToDialogContent from './PiToDialogContent';
import { schema } from './validation';

interface Props {
  initialShape: PiToState['shape'];
  setShape: (shape: [CodegenCoordinates, CodegenCoordinates]) => void;
  onDismiss: () => void;
}

export function PiToDialog({ initialShape, setShape, onDismiss }: Props) {
  const initialValues = useMemo(
    () => ({ shape: initialShape }),
    [initialShape],
  );
  const onSubmit = useCallback(
    (values: Shape) => {
      const cast = schema.cast(values) as unknown as {
        shape: [CodegenCoordinates, CodegenCoordinates];
      };
      setShape(cast.shape);
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
}
