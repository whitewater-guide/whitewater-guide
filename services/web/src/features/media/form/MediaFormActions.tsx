import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { MediaInput } from '@whitewater-guide/commons';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import useRouter from 'use-react-router';
import { RouterParams } from './types';

const MediaFormActions: React.FC = React.memo(() => {
  const { history } = useRouter<RouterParams>();
  const { initialValues, submitForm } = useFormikContext<MediaInput>();
  const submitLabel = initialValues.url ? 'Update' : 'Create';
  const onCancel = useCallback(() => history.goBack(), [history.goBack]);
  return (
    <DialogActions>
      <Button variant="contained" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="contained" color="primary" onClick={submitForm}>
        {submitLabel}
      </Button>
    </DialogActions>
  );
});

MediaFormActions.displayName = 'MediaFormActions';

export default MediaFormActions;
