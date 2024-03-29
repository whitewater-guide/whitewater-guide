import red from '@material-ui/core/colors/red';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  FormikPasswordField,
  FormikTextField,
  NextButton,
} from '../../components';
import FacebookButton from './FacebookButton';

interface Props {
  errors?: any;
  isValid?: boolean;
  isLoadingLocal?: boolean;
  isLoadingFB?: boolean;
  onPressLocal?: () => void;
  onPressFB?: () => void;
}

const LoginStepView: React.FC<Props> = (props) => {
  const {
    isValid,
    isLoadingLocal,
    isLoadingFB,
    errors,
    onPressLocal,
    onPressFB,
    ...stepContentProps
  } = props;
  const { t } = useTranslation();
  return (
    <StepContent {...stepContentProps}>
      <FormikTextField
        name="email"
        fullWidth
        label="email"
        autoComplete="username"
        margin="normal"
      />
      <FormikPasswordField
        name="password"
        autoComplete="new-password"
        fullWidth
        label={t('login:password')}
      />
      {!!errors && !!errors.form && (
        <Typography gutterBottom noWrap style={{ color: red[500] }}>
          {t(errors.form)}
        </Typography>
      )}
      <div>
        <NextButton
          fullWidth
          disabled={!isValid || !!isLoadingFB}
          onClick={onPressLocal}
          loading={!!isLoadingLocal}
        />
        <FacebookButton
          onClick={onPressFB}
          loading={!!isLoadingFB}
          disabled={!!isLoadingLocal}
        />
      </div>
    </StepContent>
  );
};

export default LoginStepView;
