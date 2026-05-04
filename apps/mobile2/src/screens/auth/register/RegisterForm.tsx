import { useNavigation } from '@react-navigation/native';
import type { RegisterPayload } from '@whitewater-guide/clients';
import { useAuth } from '@whitewater-guide/clients';
import { Formik } from 'formik';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Screens } from '../../../core/navigation';
import HelperText from '../../../forms/HelperText';
import PasswordField from '../../../forms/password-field';
import TextField from '../../../forms/TextField';
import theme from '../../../theme';
import { useAuthSubmit } from '../useAuthSubmit';
import getValidationSchema from './getValidationSchema';
import type { RegisterScreenProps } from './navigation-types';

const styles = StyleSheet.create({
  submitButton: {
    marginTop: theme.margin.double,
  },
});

function RegisterForm() {
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
  const { navigate } = useNavigation<RegisterScreenProps['navigation']>();
  const onSuccess = useCallback(
    () => navigate(Screens.AUTH_WELCOME),
    [navigate],
  );
  const [submit] = useAuthSubmit(
    'screens:auth.register.',
    service.signUp,
    onSuccess,
  );

  return (
    <Formik<RegisterPayload>
      initialValues={initialValues}
      validationSchema={getValidationSchema()}
      onSubmit={submit}
    >
      {({ isSubmitting, errors, handleSubmit }) => (
        <>
          <View>
            <Text variant="titleLarge">{t('screens:auth.register.title')}</Text>
            <TextField
              name="email"
              testID="auth:email"
              label={t('commons:email')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={false}
              textContentType="emailAddress"
              returnKeyType="next"
            />
            <TextField
              name="name"
              testID="auth:name"
              label={t('screens:auth.register.name')}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="username"
              returnKeyType="next"
            />
            <PasswordField
              name="password"
              testID="auth:password"
              label={t('commons:password')}
              showStrengthIndicator
              returnKeyType="done"
            />
          </View>
          <View>
            {(errors as any)?.form && (
              <HelperText error={t((errors as any).form)} touched noPad />
            )}
            <Button
              loading={isSubmitting}
              mode="contained"
              style={styles.submitButton}
              testID="auth:submit"
              onPress={isSubmitting ? undefined : (handleSubmit as any)}
            >
              {t('screens:auth.register.submit')}
            </Button>
          </View>
        </>
      )}
    </Formik>
  );
}

export default memo(RegisterForm);
