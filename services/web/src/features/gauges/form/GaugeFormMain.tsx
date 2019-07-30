import Box from '@material-ui/core/Box';
import React from 'react';
import { POIField, TextField } from '../../../formik/fields';
import useNilCoordinates from './useNillCoordinates';

const GaugeFormMain: React.FC = React.memo(() => {
  useNilCoordinates('location');
  return (
    <Box padding={1} overflow="auto">
      <TextField fullWidth={true} name="name" label="Name" />
      <TextField fullWidth={true} name="code" label="Code" />
      <POIField
        name="location"
        title="Gauge"
        mapBounds={null}
        detailed={false}
      />
      <TextField fullWidth={true} name="levelUnit" label="Level unit" />
      <TextField fullWidth={true} name="flowUnit" label="Flow unit" />
      <TextField fullWidth={true} name="url" label="URL" />
      <TextField fullWidth={true} name="requestParams" label="Request params" />
      <TextField fullWidth={true} name="cron" label="Cron" />
    </Box>
  );
});

GaugeFormMain.displayName = 'GaugeFormMain';

export default GaugeFormMain;
