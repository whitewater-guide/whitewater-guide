import { SectionAdminSettings } from '@whitewater-guide/schema';

import { AdministrateSectionMutationVariables } from './administrateSection.generated';

const makeFormToMutation =
  (sectionId: string) =>
  (form: SectionAdminSettings): AdministrateSectionMutationVariables => ({
    settings: {
      demo: form.demo,
    },
    sectionId,
  });

export default makeFormToMutation;
