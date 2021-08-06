import { useState } from 'react';
import { useDebounce } from 'use-debounce';

import { useAddSectionRegion } from '../context';
import {
  ListedGaugeFragment,
  useFindGaugesQuery,
} from './findGauges.generated';

type Result = [string, (txt: string) => void, boolean, ListedGaugeFragment[]];

const useGaugesQuery = (initialInput = ''): Result => {
  const region = useAddSectionRegion();
  const [input, setInput] = useState(initialInput);
  const [search] = useDebounce(input, 200);

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
};

export default useGaugesQuery;
