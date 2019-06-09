import { ResetPayload, useAuth } from '@whitewater-guide/clients';
import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import { Formik } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { Spacer } from '../../../components';
import {
  ErrorText,
  PasswordField,
  SuccessText,
} from '../../../components/forms';
import { useAuthSubmit } from '../useAuthSubmit';
import getValidationSchema from './getValidationSchema';
import { ResetParams } from './types';

export const ResetForm: React.FC<ResetParams> = ({ id, token }) => {
  const initialValues: ResetPayload = useMemo(
    () => ({
      id,
      token,
      password: '',
    }),
    [id, token],
  );
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const back = useCallback(() => navigate('AuthSignIn'), [navigate]);
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
            mode="outlined"
            showStrengthIndicator={true}
          />
          <Spacer />
          <ErrorText touched={submitCount > 0} error={(errors as any).form} />
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
