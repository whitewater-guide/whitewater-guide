import { SectionAdminSettings } from '@whitewater-guide/commons';
import { QResult } from './sectionAdmin.query';

const queryToForm = (data: QResult | undefined): SectionAdminSettings => {
  if (!data || !data.settings) {
    return { demo: false };
  }
  const {
    settings: { demo },
  } = data;
  return { demo };
};

export default queryToForm;
