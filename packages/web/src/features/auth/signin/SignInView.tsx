import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';

import { PasswordField, TextField } from '../../../formik/fields';
import FacebookButton from './FacebookButton';

interface Props {
  errors?: any;
  isValid?: boolean;
  isLoadingLocal?: boolean;
  isLoadingFB?: boolean;
  onPressLocal?: () => void;
  onPressFB?: () => void;
  status?: {
    success: boolean;
    error?: any;
  };
}

const SignInView: React.FC<Props> = React.memo((props) => {
  const {
    isValid,
    isLoadingLocal,
    isLoadingFB,
    errors,
    onPressLocal,
    onPressFB,
  } = props;
  return (
    <Grid container={true} spacing={1}>
      <Grid item={true} xs={12}>
        <Typography variant="h5" gutterBottom={true}>
          Sign in
        </Typography>
      </Grid>
      <Grid item={true} xs={12}>
        <TextField
          name="email"
          fullWidth={true}
          label="email"
          placeholder="email"
          autoComplete="username"
        />
      </Grid>
      <Grid item={true} xs={12}>
        <PasswordField
          name="password"
          autoComplete="new-password"
          fullWidth={true}
          label="Password"
          placeholder="Password"
        />
      </Grid>
      {!!errors && !!errors.form && (
        <Typography gutterBottom={true} noWrap={true} color="error">
          {errors.form}
        </Typography>
      )}
      <Grid item={true} xs={12}>
        <Button
          variant="contained"
          color="primary"
          fullWidth={true}
          disabled={!isValid || !!isLoadingFB}
          onClick={onPressLocal}
        >
          Sign in with email
        </Button>
        <FacebookButton
          onClick={onPressFB}
          loading={!!isLoadingFB}
          disabled={!!isLoadingLocal}
        />
      </Grid>
    </Grid>
  );
});

SignInView.displayName = 'SignInView';

export default SignInView;
