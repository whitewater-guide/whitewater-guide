import ListSources from "./ListSources";
import ListSourcesLeft from "./ListSourcesLeft";
import SourceForm from "./SourceForm";
import ViewSource from "./ViewSource";
import ViewSourceLeft from "./ViewSourceLeft";
import SourceSchedule from "./SourceSchedule";
import TermsOfUse from "./TermsOfUse";

export const sourcesRoutes = [
  {
    path: '/sources',
    exact: true,
    content: ListSources,
    left: ListSourcesLeft,
  },
  {
    path: '/sources/:sourceId',
    exact: true,
    content: ViewSource,
    left: ViewSourceLeft,
  },
  {
    path: '/sources/new',
    content: SourceForm,
  },
  {
    path: '/sources/:sourceId/settings',
    content: SourceForm,
    left: ViewSourceLeft,
  },
  {
    path: '/sources/:sourceId/schedule',
    content: SourceSchedule,
    left: ViewSourceLeft,
  },
  {
    path: '/sources/:sourceId/terms_of_use',
    content: TermsOfUse,
    left: ViewSourceLeft,
  },
];

