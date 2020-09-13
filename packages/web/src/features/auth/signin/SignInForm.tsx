import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Credentials, useAuth } from '@whitewater-guide/clients';
import { Formik } from 'formik';
import React from 'react';

import SignInView from './SignInView';
import useFacebookSignIn from './useFacebookSignIn';
import useLocalSignIn from './useLocalSignIn';
import validation from './validation';

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    container: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      padding: spacing(2),
    },
  }),
);

const initialValues: Credentials = { email: '', password: '' };

const SignInForm: React.FC = React.memo(() => {
  const classes = useStyles();
  const { loading } = useAuth();

  const onSignIn = useLocalSignIn();
  const onFB = useFacebookSignIn();

  return (
    <Container maxWidth="xs" className={classes.container}>
      <Paper className={classes.paper}>
        <Formik<Credentials>
          initialValues={initialValues}
          isInitialValid={false}
          validationSchema={validation}
          onSubmit={onSignIn}
        >
          {({ isSubmitting, handleSubmit, isValid, errors, status }) => {
            return (
              <SignInView
                errors={errors}
                isValid={isValid}
                isLoadingFB={loading && !isSubmitting}
                isLoadingLocal={isSubmitting}
                onPressLocal={handleSubmit}
                onPressFB={onFB}
                status={status}
              />
            );
          }}
        </Formik>
      </Paper>
    </Container>
  );
});

SignInForm.displayName = 'SignInForm';

export default SignInForm;
