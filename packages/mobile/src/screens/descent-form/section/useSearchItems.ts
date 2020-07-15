import {
  SearchData,
  SectionType,
  NEW_SECTION,
  LOADING_RECENT,
  LOADING_LOGBOOK,
  LOADING_DB,
} from './types';
import useRecentSections from './useRecentSections';
import useSearchSections from './useSearchSections';

export default (input: string): SearchData => {
  const recent = useRecentSections(!!input);
  const found = useSearchSections(input);
  return input
    ? [
        {
          id: SectionType.SEARCH_LOGBOOK,
          data: found.loading ? [{ id: LOADING_LOGBOOK }] : found.logbook,
        },
        {
          id: SectionType.SEARCH_DB,
          data: found.loading ? [{ id: LOADING_DB }] : found.db,
        },
      ]
    : [
        {
          id: SectionType.NEW_ITEM,
          data: [{ id: NEW_SECTION }],
        },
        {
          id: SectionType.RECENT,
          data: recent.loading ? [{ id: LOADING_RECENT }] : recent.sections,
        },
      ];
};
