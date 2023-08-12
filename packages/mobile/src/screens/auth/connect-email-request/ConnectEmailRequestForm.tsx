import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { FC, RefObject, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import Spacer from '~/components/Spacer';
import { Screens } from '~/core/navigation';
import HelperText from '~/forms/HelperText';
import TextField from '~/forms/TextField';

import getValidationSchema from './getValidationSchema';
import { RequestConnectEmailMutationVariables } from './requestConnectEmail.generated';
import { ConnectEmailRequestNavProp } from './types';
import useRequestConnectEmailForm from './useRequestConnectEmailForm';

interface Props {
  keyboardScrollRef: RefObject<View>;
  email?: string;
}

export const ConnectEmailRequestForm: FC<Props> = ({
  keyboardScrollRef,
  email,
}) => {
  const { replace } = useNavigation<ConnectEmailRequestNavProp>();
  const { t } = useTranslation();
  const submit = useRequestConnectEmailForm();
  const initialValues = useMemo<RequestConnectEmailMutationVariables>(
    () => ({
      email: email ?? '',
    }),
    [email],
  );

  return (
    <Formik<RequestConnectEmailMutationVariables>
      initialValues={initialValues}
      validationSchema={getValidationSchema()}
      onSubmit={submit}
    >
      {({ isSubmitting, handleSubmit, submitCount, errors, values }) => (
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
              helperText={t('screens:connectEmailRequest.emailHelper')}
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
              {t('screens:connectEmailRequest.submit')}
            </Button>

            <Button
              mode="text"
              onPress={() => {
                replace(Screens.CONNECT_EMAIL, {
                  email: values.email,
                  editableEmail: true,
                });
              }}
              disabled={isSubmitting}
            >
              {t('screens:connectEmailRequest.gotToken')}
            </Button>
          </View>
        </>
      )}
    </Formik>
  );
};
