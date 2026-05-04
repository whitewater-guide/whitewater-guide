import type { DescentSectionFragment } from '@whitewater-guide/schema';
import { useCallback, useEffect, useRef } from 'react';

import Screen from '../../../components/Screen';
import { Screens } from '../../../core/navigation';
import { useDescentFormDraft } from '../DescentFormDraftContext';
import type { DescentFormData } from '../types';
import type { DescentFormSectionScreenProps } from './navigation-types';
import SectionSearch from './SectionSearch';

function DescentFormSectionScreen({
  route,
  navigation,
}: DescentFormSectionScreenProps) {
  const { descentId, regionId, formData } = route.params ?? {};
  const { draft, setDraft, prefillFromDescent } = useDescentFormDraft();
  const prefillDoneRef = useRef(false);

  useEffect(() => {
    if (prefillDoneRef.current) {
      return;
    }
    prefillDoneRef.current = true;
    if (descentId) {
      prefillFromDescent(descentId);
    } else if (formData) {
      setDraft(() => formData as Partial<DescentFormData>);
    }
  }, [descentId, formData, prefillFromDescent, setDraft]);

  const setSection = useCallback(
    (section: DescentSectionFragment) => {
      setDraft((prev) => ({ ...prev, section }));
      navigation.navigate(Screens.DESCENT_FORM_DATE);
    },
    [setDraft, navigation],
  );

  return (
    <Screen padding>
      <SectionSearch
        onSelect={setSection}
        section={draft.section}
        regionId={regionId}
      />
    </Screen>
  );
}

export default DescentFormSectionScreen;
