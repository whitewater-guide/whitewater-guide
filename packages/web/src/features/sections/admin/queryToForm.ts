import { SectionAdminSettings } from '@whitewater-guide/schema';

import { SectionAdminSettingsQuery } from './sectionAdminSettings.generated';

const queryToForm = (
  data?: SectionAdminSettingsQuery,
): SectionAdminSettings => {
  if (!data || !data.settings) {
    return { demo: false };
  }
  const {
    settings: { demo },
  } = data;
  return { demo: !!demo };
};

export default queryToForm;
