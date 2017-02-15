import ListSections from "./ListSections";
import SectionsLeft from "./SectionsLeft";
import SectionForm from "./SectionForm";
import ViewSection from "./ViewSection";

export const sectionsRoutes = [
  {
    path: '/sections',
    exact: true,
    content: ListSections,
  },
  {
    path: '/sections/new',
    content: SectionForm,
    left: SectionsLeft,
  },
  {
    path: '/sections/:sectionId',
    exact: true,
    content: ViewSection,
    left: SectionsLeft,
  },
  {
    path: '/sections/:sectionId/settings',
    content: SectionForm,
    left: SectionsLeft,
  },
];

