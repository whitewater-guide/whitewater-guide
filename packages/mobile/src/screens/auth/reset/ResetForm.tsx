import { useNavigation } from '@react-navigation/native';
import { ResetPayload, useAuth } from '@whitewater-guide/clients';
import { Formik } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';

import Spacer from '~/components/Spacer';
import { Screens } from '~/core/navigation';
import HelperText from '~/forms/HelperText';
import PasswordField from '~/forms/password-field';
import SuccessText from '~/forms/SuccessText';

import { useAuthSubmit } from '../useAuthSubmit';
import getValidationSchema from './getValidationSchema';
import { AuthResetNavProp } from './types';

interface Props {
  id: string;
  token: string;
}

export const ResetForm: React.FC<Props> = ({ id, token }) => {
  const initialValues: ResetPayload = useMemo(
    () => ({
      id,
      token,
      password: '',
    }),
    [id, token],
  );
  const { t } = useTranslation();
  const { navigate } = useNavigation<AuthResetNavProp>();
  const back = useCallback(() => navigate(Screens.AUTH_SIGN_IN), [navigate]);
  const { service } = useAuth();
  const [submit, isSuccessful] = useAuthSubmit(
    'screens:auth.reset.',
    service.reset,
  );
  return (
    <Formik<ResetPayload>
      initialValues={initialValues}
      onSubmit={submit}
      validationSchema={getValidationSchema()}
    >
      {({ isSubmitting, handleSubmit, submitCount, errors }) => (
        <React.Fragment>
          <PasswordField
            name="password"
            label={t('screens:auth.reset.newPassword')}
            showStrengthIndicator={true}
          />
          <Spacer />
          <HelperText touched={submitCount > 0} error={(errors as any).form} />
          <SuccessText
            visible={isSuccessful}
            message="screens:auth.reset.success"
          />
          <Button
            mode="contained"
            loading={isSubmitting}
            onPress={
              isSuccessful
                ? back
                : isSubmitting
                ? undefined
                : (handleSubmit as any)
            }
          >
            {isSuccessful
              ? t('screens:auth.reset.goBack')
              : t('screens:auth.reset.submit')}
          </Button>
        </React.Fragment>
      )}
    </Formik>
  );
};
