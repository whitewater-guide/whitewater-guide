import { DescentSectionFragment } from '@whitewater-guide/schema';
import uniqBy from 'lodash/uniqBy';
import { useMemo } from 'react';

import { useSearchSectionsQuery } from './findSections.generated';

export function useSearchSections(
  search: string,
  mandatory?: DescentSectionFragment,
  regionId?: string,
) {
  const query = useSearchSectionsQuery({
    fetchPolicy: 'no-cache',
    variables: { search, regionId, skipRecent: !!search },
  });
  const { data, loading } = query;

  const result = useMemo(() => {
    const recent = uniqBy(
      data?.myDescents?.edges.map((e) => e.node.section) || [],
      'id',
    );
    const found = search ? data?.sections.nodes || [] : [];
    if (mandatory && !found.some((s) => s.id === mandatory.id)) {
      found.unshift(mandatory);
    }
    const all = [];
    if (recent.length) {
      all.push({ id: 'Recent', data: recent });
    }
    if (search) {
      all.push({ id: 'Search', data: found });
    }
    return all;
  }, [data, search, mandatory]);
  return { loading, result };
}

export type SearchResults = ReturnType<typeof useSearchSections>;
