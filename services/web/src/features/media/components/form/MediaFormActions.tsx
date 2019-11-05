import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { getIn, useFormikContext } from 'formik';
import isEmpty from 'lodash/isEmpty';
import React from 'react';

interface Props {
  prefix?: string;
  onCancel: () => void;
  onSubmit: () => any;
}

const MediaFormActions: React.FC<Props> = React.memo(
  ({ onCancel, onSubmit, prefix = '' }) => {
    const { initialValues, errors } = useFormikContext<any>();
    const url = getIn(initialValues, `${prefix}url`);
    const submitLabel = url ? 'Update' : 'Create';
    const mediaErrors = prefix
      ? getIn(errors, prefix.replace(/\.$/, ''))
      : errors;
    const isValid = isEmpty(mediaErrors);
    return (
      <DialogActions>
        <Button variant="contained" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onSubmit}
          disabled={!isValid}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    );
  },
);

MediaFormActions.displayName = 'MediaFormActions';

export default MediaFormActions;
