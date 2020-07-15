import React, { useState, useCallback } from 'react';
import SectionSearch from './SectionSearch';
import { DescentFormSectionNavProps } from './types';
import { DescentFormScreen, useUpstreamSection } from '../DescentFormContext';
import { useFormikContext } from 'formik';
import { DescentFormData } from '../types';
import { LogbookSectionInput } from '@whitewater-guide/logbook-schema';
import { Screens } from '~/core/navigation';

export const DescentFormSectionScreen: React.FC<DescentFormSectionNavProps> = ({
  navigation,
}) => {
  const { navigate } = navigation;
  const [searchMode, setSearchMode] = useState(true);
  const { setUpstreamSection } = useUpstreamSection();
  const formik = useFormikContext<DescentFormData>();

  const setSection = useCallback(
    (section: LogbookSectionInput) => {
      formik.setFieldValue('section', section);
      navigate(Screens.DESCENT_FORM_DATE);
    },
    [formik, navigate, setUpstreamSection],
  );

  return (
    <DescentFormScreen padding={true}>
      {searchMode ? (
        <SectionSearch setSearchMode={setSearchMode} onSelect={setSection} />
      ) : null}
    </DescentFormScreen>
  );
};
