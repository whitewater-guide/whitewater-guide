import { StepProps } from '@material-ui/core/Step';
import { Credentials, useAuth } from '@whitewater-guide/clients';
import { Formik } from 'formik';
import React, { useCallback } from 'react';

import getValidationSchema from './getValidationSchema';
import LoginStepView from './LoginStepView';
import useSignIn from './useSignIn';

type Props = Omit<StepProps, 'classes'> & {
  next: () => void;
};

const initialValues: Credentials = { email: '', password: '' };

const LoginStepForm: React.FC<Props> = (props) => {
  const { next, ...stepContentProps } = props;
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
    [next, service],
  );

  return (
    <Formik<Credentials>
      initialValues={initialValues}
      isInitialValid={false}
      validationSchema={getValidationSchema()}
      onSubmit={submit}
    >
      {({ isSubmitting, handleSubmit, isValid, errors }) => (
        <LoginStepView
          {...stepContentProps}
          errors={errors}
          isValid={isValid}
          isLoadingFB={loading && !isSubmitting}
          isLoadingLocal={isSubmitting}
          onPressLocal={handleSubmit}
          onPressFB={onPressFB}
        />
      )}
    </Formik>
  );
};

export default LoginStepForm;
