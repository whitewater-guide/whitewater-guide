import red from '@material-ui/core/colors/red';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikTextField, NextButton } from '../../components';
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
        fullWidth={true}
        label="email"
        margin="normal"
      />
      <FormikTextField
        name="password"
        fullWidth={true}
        label={t('login:password')}
        margin="normal"
      />
      {!!errors && !!errors.form && (
        <Typography
          gutterBottom={true}
          noWrap={true}
          style={{ color: red[500] }}
        >
          {t(errors.form)}
        </Typography>
      )}
      <div>
        <NextButton
          fullWidth={true}
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
