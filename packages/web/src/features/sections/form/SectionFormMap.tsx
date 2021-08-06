import Box from '@material-ui/core/Box';
import { Region } from '@whitewater-guide/schema';
import React from 'react';

import {
  CoordinateArray,
  DrawingMapField,
  KmlUploaderField,
} from '../../../formik/fields';

interface Props {
  bounds: Region['bounds'] | null;
}

export const SectionFormMap: React.FC<Props> = ({ bounds }) => (
  <>
    <Box flex={1}>
      <DrawingMapField name="shape" drawingMode="LineString" bounds={bounds} />
    </Box>
    <Box padding={1} display="flex" flexDirection="column">
      <KmlUploaderField name="shape" />
      <CoordinateArray name="shape" />
    </Box>
  </>
);
