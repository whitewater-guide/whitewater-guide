import { SECTION_NAME } from '@whitewater-guide/clients';
import { Section, sectionName } from '@whitewater-guide/commons';
import { createBreadcrumb } from '../../components';

export default createBreadcrumb({
  query: SECTION_NAME,
  resourceType: 'section',
  renderName: (section: Section) => sectionName(section),
});
