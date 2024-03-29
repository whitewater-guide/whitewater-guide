import { useNavigation } from '@react-navigation/native';
import type { RequestResetPayload } from '@whitewater-guide/clients';
import { useAuth } from '@whitewater-guide/clients';
import { Formik } from 'formik';
import type { FC, RefObject } from 'react';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import Spacer from '~/components/Spacer';
import { Screens } from '~/core/navigation';
import HelperText from '~/forms/HelperText';
import SuccessText from '~/forms/SuccessText';
import TextField from '~/forms/TextField';

import { useAuthSubmit } from '../useAuthSubmit';
import getValidationSchema from './getValidationSchema';
import type { AuthForgotNavProp } from './types';

const initialValues: RequestResetPayload = {
  email: '',
};

interface Props {
  keyboardScrollRef: RefObject<View>;
}

export const ForgotForm: FC<Props> = ({ keyboardScrollRef }) => {
  const { t } = useTranslation();
  const { service } = useAuth();
  const { navigate } = useNavigation<AuthForgotNavProp>();
  const goBack = useCallback(() => {
    navigate(Screens.REGIONS_LIST);
  }, [navigate]);
  const [submit, isSuccessful] = useAuthSubmit<RequestResetPayload>(
    'screens:auth.forgot.',
    service.requestReset,
  );
  return (
    <Formik<RequestResetPayload>
      initialValues={initialValues}
      validationSchema={getValidationSchema()}
      onSubmit={submit}
    >
      {({ isSubmitting, handleSubmit, submitCount, errors }) => (
        <View ref={keyboardScrollRef}>
          <TextField
            name="email"
            label={t('commons:email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={false}
            textContentType="emailAddress"
          />
          <SuccessText
            visible={isSuccessful}
            message="screens:auth.forgot.success"
          />
          <Spacer />
          <HelperText
            noPad
            touched={submitCount > 0}
            error={(errors as any).form}
          />
          <Button
            mode="contained"
            loading={isSubmitting}
            onPress={
              isSuccessful
                ? goBack
                : isSubmitting
                ? undefined
                : (handleSubmit as any)
            }
          >
            {isSuccessful
              ? t('screens:auth.forgot.goBack')
              : t('screens:auth.forgot.submit')}
          </Button>
        </View>
      )}
    </Formik>
  );
};
