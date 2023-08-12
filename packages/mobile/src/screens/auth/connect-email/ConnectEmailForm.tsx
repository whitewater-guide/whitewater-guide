import { Formik } from 'formik';
import { FC, RefObject, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import Spacer from '~/components/Spacer';
import HelperText from '~/forms/HelperText';
import PasswordField from '~/forms/password-field';
import TextField from '~/forms/TextField';

import { ConnectEmailMutationVariables } from './connectEmail.generated';
import getValidationSchema from './getValidationSchema';
import useConnectEmailForm from './useConnectEmailForm';

interface Props {
  keyboardScrollRef: RefObject<View>;
  editableEmail?: boolean;
  email: string;
  token?: string;
}

export const ConnectEmailForm: FC<Props> = (props) => {
  const { keyboardScrollRef, email, editableEmail, token } = props;
  const { t } = useTranslation();

  const initialValues = useMemo<ConnectEmailMutationVariables>(
    () => ({
      email: email,
      password: '',
      token: token ?? '',
    }),
    [email, token],
  );

  const passwordField = useRef<any>();
  const tokenField = useRef<any>();

  const onEmailSubmit = useCallback(() => {
    passwordField.current?.focus();
  }, [passwordField]);

  const onPasswordSubmit = useCallback(() => {
    tokenField.current?.focus();
  }, [tokenField]);

  const submit = useConnectEmailForm();

  return (
    <Formik<ConnectEmailMutationVariables>
      initialValues={initialValues}
      validationSchema={getValidationSchema()}
      onSubmit={submit}
      enableReinitialize={true}
    >
      {({ isSubmitting, handleSubmit, submitCount, errors }) => (
        <>
          <View>
            <TextField
              name="email"
              label={t('commons:email')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={false}
              textContentType="emailAddress"
              editable={!!editableEmail}
              helperText={
                email ? undefined : t('screens:connectEmail.emailHelper')
              }
              returnKeyType={editableEmail ? 'next' : 'done'}
              onSubmitEditing={editableEmail ? onEmailSubmit : undefined}
            />
            <PasswordField
              ref={passwordField}
              name="password"
              label={t('screens:connectEmail.password')}
              showStrengthIndicator
              returnKeyType={token ? 'done' : 'next'}
              onSubmitEditing={token ? undefined : onPasswordSubmit}
            />
            <TextField
              ref={tokenField}
              name="token"
              label={t('screens:connectEmail.token')}
              helperText={
                token ? undefined : t('screens:connectEmail.tokenHelper')
              }
              returnKeyType={token ? undefined : 'done'}
              editable={!token}
            />
            <Spacer />
          </View>

          <View ref={keyboardScrollRef}>
            <HelperText
              noPad
              touched={submitCount > 0}
              error={(errors as any).form}
            />
            <Button
              mode="contained"
              loading={isSubmitting}
              onPress={handleSubmit}
            >
              {t('screens:connectEmail.submit')}
            </Button>
          </View>
        </>
      )}
    </Formik>
  );
};
