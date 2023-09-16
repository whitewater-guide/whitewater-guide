import type { SectionAdminSettings } from '@whitewater-guide/schema';

import type { AdministrateSectionMutationVariables } from './administrateSection.generated';

const makeFormToMutation =
  (sectionId: string) =>
  (form: SectionAdminSettings): AdministrateSectionMutationVariables => ({
    settings: {
      demo: form.demo,
    },
    sectionId,
  });

export default makeFormToMutation;
