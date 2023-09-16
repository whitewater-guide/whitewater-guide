import type { Section } from '@whitewater-guide/schema';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';

import { Screens } from '~/core/navigation';

import { DescentFormScreen } from '../DescentFormContext';
import type { DescentFormData } from '../types';
import SectionSearch from './SectionSearch';
import type { DescentFormSectionNavProps } from './types';

export const DescentFormSectionScreen: React.FC<DescentFormSectionNavProps> = ({
  navigation,
  route,
}) => {
  const { navigate } = navigation;
  const { setFieldValue, values } = useFormikContext<DescentFormData>();
  const regionId = route.params?.regionId;

  const setSection = useCallback(
    (section: Section) => {
      setFieldValue('section', section);
      navigate(Screens.DESCENT_FORM_DATE);
    },
    [setFieldValue, navigate],
  );

  return (
    <DescentFormScreen padding>
      <SectionSearch
        onSelect={setSection}
        section={values.section}
        regionId={regionId}
      />
    </DescentFormScreen>
  );
};
