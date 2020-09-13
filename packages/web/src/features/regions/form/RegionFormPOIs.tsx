import { useFormikContext } from 'formik';
import React from 'react';

import { POIArray } from '../../../formik/fields';
import { RegionFormData } from './types';

const RegionFormPOIs: React.FC = React.memo(() => {
  const { initialValues } = useFormikContext<RegionFormData>();
  const mapBounds = initialValues.bounds || null;
  return <POIArray name="pois" mapBounds={mapBounds} />;
});

RegionFormPOIs.displayName = 'RegionFormPoIs';

export default RegionFormPOIs;
