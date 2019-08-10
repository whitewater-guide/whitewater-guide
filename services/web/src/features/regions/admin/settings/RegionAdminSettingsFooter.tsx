import Button from '@material-ui/core/Button';
import { useFormikContext } from 'formik';
import React from 'react';

const RegionAdminSettingsFooter: React.FC = () => {
  const { submitForm } = useFormikContext();
  return (
    <Button variant="contained" color="primary" onClick={submitForm}>
      Update
    </Button>
  );
};

export default RegionAdminSettingsFooter;
