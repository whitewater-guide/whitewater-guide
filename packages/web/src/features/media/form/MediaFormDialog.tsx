import Dialog from '@material-ui/core/Dialog';
import { MediaInput, MediaInputSchema } from '@whitewater-guide/commons';
import { createSafeValidator } from '@whitewater-guide/validation';
import { Formik } from 'formik';
import React, { Suspense, useCallback, useMemo } from 'react';
import useRouter from 'use-react-router';

import { Loading } from '../../../components';
import { UseApolloFormik } from '../../../formik';
import { LocalPhoto } from '../../../utils/files';
import { LazyMediaDialog } from '../components/form';
import { QResult } from './mediaForm.query';

type Props = UseApolloFormik<QResult, MediaInput>;

const MediaFormDialog: React.FC<Props> = React.memo((props) => {
  const { onSubmit, loading, initialValues } = props;
  const { history, location } = useRouter();
  const onCancel = useCallback(() => history.goBack(), [history]);
  const localPhoto: LocalPhoto | undefined =
    location.state && (location.state as any).file;

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
      {({ submitForm }) => (
        <Suspense fallback={<Loading />}>
          <LazyMediaDialog
            open={true}
            localPhoto={localPhoto}
            kind={initialValues.kind}
            onCancel={onCancel}
            onSubmit={submitForm}
          />
        </Suspense>
      )}
    </Formik>
  );
});

MediaFormDialog.displayName = 'MediaFormDialog';

export default MediaFormDialog;
