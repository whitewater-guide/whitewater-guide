import { useState } from 'react';
import useDebounce from 'react-use/lib/useDebounce';

import { useAddSectionRegion } from '../AddSectionDraftContext';
import type { ListedGaugeFragment } from './findGauges.generated';
import { useFindGaugesQuery } from './findGauges.generated';

type Result = [string, (txt: string) => void, boolean, ListedGaugeFragment[]];

export default function useGaugesQuery(initialInput = ''): Result {
  const region = useAddSectionRegion();
  const [input, setInput] = useState(initialInput);
  const [search, setSearch] = useState(initialInput);

  useDebounce(() => setSearch(input), 200, [input]);

  const { loading, data } = useFindGaugesQuery({
    variables: {
      filter: {
        search,
        regionId: region?.id,
      },
      page: { limit: 20 },
    },
    fetchPolicy: 'no-cache',
    skip: search === '',
  });

  return [input, setInput, loading, data?.gauges?.nodes ?? []];
}
