import Box from '@material-ui/core/Box';
import React from 'react';

import { AutocompleteField, POIField, TextField } from '../../../formik/fields';
import { TIMEZONES } from '../../../utils/timezones';
import useNilCoordinates from './useNillCoordinates';

const GaugeFormMain: React.FC = React.memo(() => {
  useNilCoordinates('location');
  return (
    <Box padding={1} overflow="auto">
      <TextField fullWidth name="name" label="Name" />
      <TextField fullWidth name="code" label="Code" />
      <POIField
        name="location"
        title="Gauge"
        mapBounds={null}
        detailed={false}
      />
      <TextField fullWidth name="levelUnit" label="Level unit" />
      <TextField fullWidth name="flowUnit" label="Flow unit" />
      <TextField fullWidth name="url" label="URL" />
      <AutocompleteField
        name="timezone"
        options={TIMEZONES}
        allowNull
        placeholder="Select timezone"
        label="Timezone"
      />
      <TextField fullWidth name="requestParams" label="Request params" />
      <TextField fullWidth name="cron" label="Cron" />
    </Box>
  );
});

GaugeFormMain.displayName = 'GaugeFormMain';

export default GaugeFormMain;
