import type { RequestResetPayload } from '@whitewater-guide/clients';
import { useAuth } from '@whitewater-guide/clients';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import HelperText from '../../../forms/HelperText';
import SuccessText from '../../../forms/SuccessText';
import TextField from '../../../forms/TextField';
import { useAuthSubmit } from '../useAuthSubmit';
import getValidationSchema from './getValidationSchema';

const initialValues: RequestResetPayload = {
  email: '',
};

function ForgotForm() {
  const { t } = useTranslation();
  const { service } = useAuth();
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
        <View>
          <TextField
            name="email"
            testID="auth:email"
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
          <HelperText
            noPad
            touched={submitCount > 0}
            error={(errors as any).form}
          />
          <Button
            mode="contained"
            loading={isSubmitting}
            testID="auth:submit"
            onPress={isSubmitting ? undefined : (handleSubmit as any)}
          >
            {isSuccessful
              ? t('screens:auth.forgot.goBack')
              : t('screens:auth.forgot.submit')}
          </Button>
        </View>
      )}
    </Formik>
  );
}

export default ForgotForm;
