import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ResetPayload } from '@whitewater-guide/clients';
import { useAuth } from '@whitewater-guide/clients';
import { Formik } from 'formik';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import type { RootStackParamsList } from '../../../core/navigation';
import { Screens } from '../../../core/navigation';
import HelperText from '../../../forms/HelperText';
import PasswordField from '../../../forms/password-field';
import SuccessText from '../../../forms/SuccessText';
import { useAuthSubmit } from '../useAuthSubmit';
import getValidationSchema from './getValidationSchema';

interface Props {
  id: string;
  token: string;
}

function ResetForm({ id, token }: Props) {
  const initialValues: ResetPayload = useMemo(
    () => ({
      id,
      token,
      password: '',
    }),
    [id, token],
  );
  const { t } = useTranslation();
  const { navigate } =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();
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
        <View testID={`reset:form:${token}`} collapsable={false}>
          <PasswordField
            name="password"
            testID="auth:password"
            label={t('screens:auth.reset.newPassword')}
            showStrengthIndicator
          />
          <HelperText touched={submitCount > 0} error={(errors as any).form} />
          <SuccessText
            visible={isSuccessful}
            message="screens:auth.reset.success"
          />
          <Button
            mode="contained"
            loading={isSubmitting}
            testID="auth:submit"
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
        </View>
      )}
    </Formik>
  );
}

export default ResetForm;
