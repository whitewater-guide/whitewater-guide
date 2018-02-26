import ListSections from "./ListSections";
import SectionsLeft from "./SectionsLeft";
import SectionForm from "./SectionForm";
import ViewSection from "./ViewSection";
import SectionBreadcrumb from "./SectionBreadcrumb";
import {defaultProps} from 'recompose';
import {Breadcrumb} from '../../core/components';

export const sectionsRoutes = [
  {
    path: '/sections',
    exact: true,
    content: ListSections,
    left: SectionsLeft,
    top: defaultProps({label: 'Sections'})(Breadcrumb),
  },
  {
    path: '/sections/new',
    content: SectionForm,
    left: SectionsLeft,
    top: defaultProps({label: 'New Section'})(Breadcrumb),
  },
  {
    path: '/sections/:sectionId',
    exact: true,
    content: ViewSection,
    left: SectionsLeft,
    top: SectionBreadcrumb,
  },
  {
    path: '/sections/:sectionId/settings',
    content: SectionForm,
    left: SectionsLeft,
    top: SectionBreadcrumb,
  },
];

