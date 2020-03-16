import { useNavigation } from '@react-navigation/native';
import { Credentials, useAuth } from '@whitewater-guide/clients';
import { Formik } from 'formik';
import React, { createRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Screens } from '~/core/navigation';
import PasswordField from '~/forms/password-field';
import TextField from '~/forms/TextField';
import theme from '../../../theme';
import { useAuthSubmit } from '../useAuthSubmit';
import getValidationSchema from './getValidationSchema';
import { AuthSignInNavProp } from './types';

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
  const navigation = useNavigation<AuthSignInNavProp>();
  const forgot = useCallback(() => navigation.navigate(Screens.AUTH_FORGOT), [
    navigation.navigate,
  ]);
  const { service } = useAuth();
  const localSignIn = useCallback(
    (values: Credentials) => service.signIn('local', values),
    [service],
  );
  const passwordField = createRef<any>();
  const onEmailSubmit = useCallback(() => {
    if (passwordField.current) {
      passwordField.current.focus();
    }
  }, [passwordField]);
  const onSuccess = useCallback(() => {
    navigation.dangerouslyGetParent()?.goBack();
  }, [navigation]);
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
