import Button from '@material-ui/core/Button';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';

const RegionAdminSettingsFooter: React.FC = () => {
  const { submitForm } = useFormikContext();
  const onPress = useCallback(() => {
    submitForm();
  }, [submitForm]);
  return (
    <Button variant="contained" color="primary" onClick={onPress}>
      Update
    </Button>
  );
};

export default RegionAdminSettingsFooter;
