import { NamedNode } from '@whitewater-guide/schema';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';

import { useAddSectionRegion } from '../context';
import { useFindRiversQuery } from './findRivers.generated';

type Result = [string, (txt: string) => void, boolean, NamedNode[]];

const useRiversQuery = (initialInput = ''): Result => {
  const region = useAddSectionRegion();
  const [input, setInput] = useState(initialInput);
  const [search] = useDebounce(input, 200);

  const { loading, data } = useFindRiversQuery({
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

  return [input, setInput, loading, data?.rivers?.nodes ?? []];
};

export default useRiversQuery;
