import { createBreadcrumb } from '../../components';
import { SECTION_NAME } from '../../ww-clients/features/sections';
import { Section } from '../../ww-commons';

export default createBreadcrumb({
  query: SECTION_NAME,
  resourceType: 'section',
  renderName: (section: Section) => `${section.river.name} - ${section.name}`,
});
