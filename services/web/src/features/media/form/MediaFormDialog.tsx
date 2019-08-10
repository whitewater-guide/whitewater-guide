import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {
  createSafeValidator,
  MediaInput,
  MediaInputSchema,
  MediaKind,
} from '@whitewater-guide/commons';
import { Formik } from 'formik';
import React, { useMemo } from 'react';
import ErrorBoundary from 'react-error-boundary';
import { Loading } from '../../../components';
import { UseApolloFormik } from '../../../formik';
import { QResult } from './mediaForm.query';
import MediaFormActions from './MediaFormActions';
import MediaFormTitle from './MediaFormTitle';
import NonPhotoForm from './NonPhotoForm';
import PhotoForm from './PhotoForm';

type Props = UseApolloFormik<QResult, MediaInput>;

const MediaFormDialog: React.FC<Props> = React.memo((props) => {
  const { onSubmit, loading, initialValues, rawData } = props;

  // TODO: cannot use validation scheme directly due to this https://github.com/jaredpalmer/formik/issues/1697
  // any is because validate function can return error (https://github.com/jaredpalmer/formik/blob/217a49e6243a41a318a8973d18a7e1535b7880d5/src/Formik.tsx#L168)
  const validate: any = useMemo(
    () => createSafeValidator(MediaInputSchema),
    [],
  );

  if (loading || !initialValues) {
    return (
      <Dialog open={true} disableBackdropClick={true} maxWidth="xl">
        <Loading />
      </Dialog>
    );
  }

  return (
    <Formik<MediaInput>
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
    >
      <Dialog open={true} disableBackdropClick={true} maxWidth="xl">
        <MediaFormTitle />
        <DialogContent>
          <ErrorBoundary>
            {initialValues.kind === MediaKind.photo ? (
              <PhotoForm uploadLink={rawData!.uploadLink} />
            ) : (
              <NonPhotoForm />
            )}
          </ErrorBoundary>
        </DialogContent>
        <MediaFormActions />
      </Dialog>
    </Formik>
  );
});

MediaFormDialog.displayName = 'MediaFormDialog';

export default MediaFormDialog;
