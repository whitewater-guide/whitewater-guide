import { sectionName, SectionNameDocument } from '@whitewater-guide/clients';

import { BreadcrumbsMap } from '../../components/breadcrumbs';

export const sectionBreadcrumbs: BreadcrumbsMap = {
  '/sections': 'Sections',
  '/sections/new': 'New',
  '/sections/:sectionId': {
    query: SectionNameDocument,
    getName: ({ data }) => sectionName(data?.section),
  },
  '/sections/:sectionId/settings': 'Settings',
};
