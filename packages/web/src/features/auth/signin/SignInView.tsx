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

const SignInView = React.memo<Props>((props) => {
  const {
    isValid,
    isLoadingLocal,
    isLoadingFB,
    errors,
    onPressLocal,
    onPressFB,
  } = props;
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Sign in
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="email"
          fullWidth
          label="email"
          placeholder="email"
          autoComplete="username"
        />
      </Grid>
      <Grid item xs={12}>
        <PasswordField
          name="password"
          autoComplete="new-password"
          fullWidth
          label="Password"
          placeholder="Password"
        />
      </Grid>
      {!!errors && !!errors.form && (
        <Typography gutterBottom noWrap color="error">
          {errors.form}
        </Typography>
      )}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
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
