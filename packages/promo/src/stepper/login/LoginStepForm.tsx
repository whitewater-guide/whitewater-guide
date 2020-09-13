import { StepProps } from '@material-ui/core/Step';
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core/styles';
import { Credentials, useAuth } from '@whitewater-guide/clients';
import { Formik } from 'formik';
import React, { useCallback } from 'react';

import getValidationSchema from './getValidationSchema';
import LoginStepView from './LoginStepView';
import useSignIn from './useSignIn';

const styles = (theme: Theme) =>
  createStyles({
    progress: {
      margin: theme.spacing(2),
    },
    button: {
      marginTop: theme.spacing(),
      marginRight: theme.spacing(),
    },
    divider: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(),
    },
  });

type Props = Omit<StepProps, 'classes'> &
  WithStyles<typeof styles> & {
    next: () => void;
  };

const initialValues: Credentials = { email: '', password: '' };

const LoginStepForm: React.FC<Props> = (props) => {
  const { classes, next, ...stepContentProps } = props;
  const { service, loading } = useAuth();
  const localSignIn = useCallback(
    (values: Credentials) => service.signIn('local', values),
    [service],
  );
  const [submit] = useSignIn(localSignIn, next);
  const onPressFB = useCallback(
    () =>
      service.signIn('facebook').then(({ success }) => {
        if (success) {
          next();
        }
      }),
    [next],
  );

  return (
    <Formik<Credentials>
      initialValues={initialValues}
      isInitialValid={false}
      validationSchema={getValidationSchema()}
      onSubmit={submit}
    >
      {({ isSubmitting, handleSubmit, isValid, errors }) => {
        return (
          <LoginStepView
            {...stepContentProps}
            errors={errors}
            isValid={isValid}
            isLoadingFB={loading && !isSubmitting}
            isLoadingLocal={isSubmitting}
            onPressLocal={handleSubmit}
            onPressFB={onPressFB}
          />
        );
      }}
    </Formik>
  );
};

export default withStyles(styles)(LoginStepForm);
