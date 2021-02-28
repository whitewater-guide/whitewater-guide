import { SECTION_NAME } from '@whitewater-guide/clients';
import { sectionName } from '@whitewater-guide/commons';

import { BreadcrumbsMap } from '../../components/breadcrumbs';

export const sectionBreadcrumbs: BreadcrumbsMap = {
  '/sections': 'Sections',
  '/sections/new': 'New',
  '/sections/:sectionId': {
    query: SECTION_NAME,
    getName: ({ data }) =>
      data?.section ? sectionName(data.section) : undefined,
  },
  '/sections/:sectionId/settings': 'Settings',
};
