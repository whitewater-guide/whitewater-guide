import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import useRouter from 'use-react-router';
import { ButtonProgress } from '../components';

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    cancelWrapper: {
      marginLeft: spacing(1),
    },
  }),
);

interface Props {
  loading: boolean;
  submitLabel: string;
}

const FormikCardActions: React.FC<Props> = React.memo(
  ({ loading, submitLabel }) => {
    const { submitForm, isSubmitting } = useFormikContext();
    const classes = useStyles();
    const { history } = useRouter();
    const onCancel = useCallback(() => history.goBack(), [history]);

    return (
      <CardActions>
        <ButtonProgress loading={loading || isSubmitting}>
          <Button
            variant="contained"
            color="primary"
            onClick={submitForm}
            disabled={loading || isSubmitting}
          >
            {submitLabel}
          </Button>
        </ButtonProgress>
        <ButtonProgress
          loading={loading || isSubmitting}
          className={classes.cancelWrapper}
        >
          <Button
            variant="contained"
            onClick={onCancel}
            disabled={loading || isSubmitting}
          >
            Cancel
          </Button>
        </ButtonProgress>
      </CardActions>
    );
  },
);

FormikCardActions.displayName = 'FormikCardActions';

export default FormikCardActions;
