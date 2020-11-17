import { useNavigation } from '@react-navigation/native';
import { RegisterPayload, useAuth } from '@whitewater-guide/clients';
import { Formik } from 'formik';
import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Title } from 'react-native-paper';

import { Screens } from '~/core/navigation';
import HelperText from '~/forms/HelperText';
import PasswordField from '~/forms/password-field';
import TextField from '~/forms/TextField';
import theme from '~/theme';

import { useAuthSubmit } from '../useAuthSubmit';
import getValidationSchema from './getValidationSchema';
import { AuthRegisterNavProp } from './types';

const styles = StyleSheet.create({
  submitButton: {
    marginTop: theme.margin.double,
  },
});

export const RegisterForm: React.FC = React.memo(() => {
  const { t, i18n } = useTranslation();
  const initialValues: RegisterPayload = useMemo(
    () => ({
      email: __DEV__ ? 'test@whitewater.guide' : '',
      name: __DEV__ ? 'Test User' : '',
      password: __DEV__ ? 'qw_Erty123' : '',
      imperial: false,
      language: i18n.language,
    }),
    [i18n],
  );
  const { service } = useAuth();
  const { navigate } = useNavigation<AuthRegisterNavProp>();
  const onSuccess = useCallback(
    () => navigate(Screens.AUTH_WELCOME, { verified: false }),
    [navigate],
  );
  const [submit] = useAuthSubmit(
    'screens:auth.register.',
    service.signUp,
    onSuccess,
  );
  const nameField = useRef<any>();
  const passwordField = useRef<any>();
  const onEmailSubmit = useCallback(() => {
    if (nameField.current) {
      nameField.current.focus();
    }
  }, [nameField]);
  const onNameSubmit = useCallback(() => {
    if (passwordField.current) {
      passwordField.current.focus();
    }
  }, [passwordField]);
  return (
    <Formik<RegisterPayload>
      initialValues={initialValues}
      validationSchema={getValidationSchema()}
      onSubmit={submit}
    >
      {({ isSubmitting, errors, handleSubmit }) => (
        <React.Fragment>
          <View>
            <Title>{t('screens:auth.register.title')}</Title>
            <TextField
              name="email"
              label={t('commons:email')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={false}
              textContentType="emailAddress"
              blurOnSubmit={false}
              returnKeyType="next"
              onSubmitEditing={onEmailSubmit}
            />
            <TextField
              name="name"
              ref={nameField}
              label={t('screens:auth.register.name')}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="username"
              blurOnSubmit={false}
              returnKeyType="next"
              onSubmitEditing={onNameSubmit}
            />
            <PasswordField
              name="password"
              ref={passwordField}
              label={t('commons:password')}
              showStrengthIndicator={true}
              returnKeyType="done"
              onSubmitEditing={handleSubmit as any}
            />
          </View>
          <View>
            {(errors as any)?.form && (
              <HelperText
                error={t((errors as any).form)}
                touched={true}
                noPad={true}
              />
            )}
            <Button
              loading={isSubmitting}
              mode="contained"
              style={styles.submitButton}
              onPress={isSubmitting ? undefined : (handleSubmit as any)}
            >
              {t('screens:auth.register.submit')}
            </Button>
          </View>
        </React.Fragment>
      )}
    </Formik>
  );
});

RegisterForm.displayName = 'RegisterForm';
