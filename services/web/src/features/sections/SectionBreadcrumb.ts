import { SECTION_NAME } from '@whitewater-guide/clients';
import { Section } from '@whitewater-guide/commons';
import { createBreadcrumb } from '../../components';

export default createBreadcrumb({
  query: SECTION_NAME,
  resourceType: 'section',
  renderName: (section: Section) => `${section.river.name} - ${section.name}`,
});
