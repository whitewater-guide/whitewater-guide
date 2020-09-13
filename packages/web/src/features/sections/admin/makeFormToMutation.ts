import { SectionAdminSettings } from '@whitewater-guide/commons';

import { MVars } from './administrateSection.mutation';

const makeFormToMutation = (sectionId: string) => (
  form: SectionAdminSettings,
): MVars => {
  return {
    settings: {
      demo: form.demo,
    },
    sectionId,
  };
};

export default makeFormToMutation;
