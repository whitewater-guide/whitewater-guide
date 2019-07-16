import { useAuth } from '@whitewater-guide/clients';
import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import { Formik } from 'formik';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { RequestResetPayload } from '../../../../../clients/src/auth';
import { Spacer } from '../../../components';
import { ErrorText, SuccessText, TextField } from '../../../components/forms';
import Screens from '../../screen-names';
import { useAuthSubmit } from '../useAuthSubmit';
import getValidationSchema from './getValidationSchema';

const initialValues: RequestResetPayload = {
  email: '',
};

export const ForgotForm: React.FC = () => {
  const { t } = useTranslation();
  const { service } = useAuth();
  const { navigate } = useNavigation();
  const goBack = useCallback(() => {
    navigate(Screens.RegionsList);
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
        <React.Fragment>
          <TextField
            name="email"
            label={t('screens:auth.forgot.email')}
            keyboardType="email-address"
            mode="outlined"
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
          <ErrorText
            noPad={true}
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
        </React.Fragment>
      )}
    </Formik>
  );
};
