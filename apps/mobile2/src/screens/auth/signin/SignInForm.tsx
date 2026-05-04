import { useNavigation } from '@react-navigation/native';
import type { Credentials } from '@whitewater-guide/clients';
import { useAuth } from '@whitewater-guide/clients';
import { Formik } from 'formik';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import { Screens } from '../../../core/navigation/screen-names';
import HelperText from '../../../forms/HelperText';
import PasswordField from '../../../forms/password-field';
import TextField from '../../../forms/TextField';
import theme from '../../../theme';
import { useAuthSubmit } from '../useAuthSubmit';
import getValidationSchema from './getValidationSchema';
import type { SignInScreenProps } from './navigation-types';

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

function SignInForm() {
  const { loading } = useAuth();
  const { t } = useTranslation();
  const { navigate } = useNavigation<SignInScreenProps['navigation']>();
  const forgot = useCallback(() => navigate(Screens.AUTH_FORGOT), [navigate]);
  const { service } = useAuth();
  const localSignIn = useCallback(
    (values: Credentials) => service.signIn('local', values),
    [service],
  );

  const [submit] = useAuthSubmit('screens:auth.signin.', localSignIn);

  return (
    <Formik<Credentials>
      initialValues={initialValues}
      validationSchema={getValidationSchema()}
      onSubmit={submit}
    >
      {({ isSubmitting, errors, handleSubmit }) => (
        <>
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
          <PasswordField
            name="password"
            testID="auth:password"
            label={t('commons:password')}
            returnKeyType="done"
          />
          <Button
            mode="text"
            style={styles.forgot}
            compact
            onPress={forgot}
            testID="auth:forgot"
          >
            {t('screens:auth.signin.forgot')}
          </Button>
          {(errors as any)?.form && (
            <HelperText error={t((errors as any).form)} touched noPad />
          )}
          <Button
            mode="contained"
            loading={isSubmitting}
            testID="auth:submit-sign-in"
            onPress={
              isSubmitting || loading ? undefined : (handleSubmit as any)
            }
          >
            {t('screens:auth.signin.submit')}
          </Button>
        </>
      )}
    </Formik>
  );
}

export default SignInForm;
