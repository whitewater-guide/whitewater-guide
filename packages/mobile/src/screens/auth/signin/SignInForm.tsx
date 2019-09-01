import { Credentials, useAuth } from '@whitewater-guide/clients';
import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import { Formik } from 'formik';
import React, { createRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { PasswordField, TextField } from '../../../components/forms';
import theme from '../../../theme';
import Screens from '../../screen-names';
import { useAuthSubmit } from '../useAuthSubmit';
import getValidationSchema from './getValidationSchema';

const styles = StyleSheet.create({
  forgot: {
    alignItems: 'flex-start',
    marginBottom: theme.margin.double,
  },
});

const initialValues: Credentials = {
  email: __DEV__ ? 'test@whitewater.guide' : '',
  password: __DEV__ ? 'qw_Erty123' : '',
};

export const SignInForm: React.FC = () => {
  const { loading } = useAuth();
  const { t } = useTranslation();
  const { navigate, popToTop } = useNavigation();
  const forgot = useCallback(() => navigate(Screens.Auth.Forgot), [navigate]);
  const { service } = useAuth();
  const localSignIn = useCallback(
    (values: Credentials) => service.signIn('local', values),
    [service],
  );
  const passwordField = createRef<TextInput>();
  const onEmailSubmit = useCallback(() => {
    if (passwordField.current) {
      passwordField.current.focus();
    }
  }, [passwordField]);
  const onSuccess = useCallback(() => {
    popToTop();
  }, [popToTop]);
  const [submit] = useAuthSubmit(
    'screens:auth.signin.',
    localSignIn,
    onSuccess,
  );
  return (
    <Formik<Credentials>
      initialValues={initialValues}
      validationSchema={getValidationSchema()}
      onSubmit={submit}
    >
      {({ isSubmitting, handleSubmit }) => (
        <React.Fragment>
          <TextField
            name="email"
            label={t('commons:email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={false}
            textContentType="emailAddress"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={onEmailSubmit}
          />
          <PasswordField
            ref={passwordField}
            name="password"
            label={t('commons:password')}
            returnKeyType="done"
            onSubmitEditing={handleSubmit as any}
          />
          <Button
            mode="text"
            uppercase={false}
            style={styles.forgot}
            compact={true}
            onPress={forgot}
          >
            {t('screens:auth.signin.forgot')}
          </Button>
          <Button
            mode="contained"
            loading={isSubmitting}
            onPress={
              isSubmitting || loading ? undefined : (handleSubmit as any)
            }
          >
            {t('screens:auth.signin.submit')}
          </Button>
        </React.Fragment>
      )}
    </Formik>
  );
};
