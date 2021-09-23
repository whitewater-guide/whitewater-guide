import { NEW_RIVER_ID } from '@whitewater-guide/commons';
import { NamedNode } from '@whitewater-guide/schema';
import React, { useState } from 'react';
import { SectionListData, SectionListProps } from 'react-native';
import { useDebounce } from 'use-debounce';

import OfflineListHeader from '~/components/OfflineListHeader';

import { useAddSectionRegion } from '../context';
import { useFindRiversQuery } from './findRivers.generated';
import RiversListItem from './RiversListItem';
import RiversListSection from './RiversListSection';
import RiversListSeparator from './RiversListSeparator';
import { RiversListDataItem } from './types';

type Result = SectionListProps<RiversListDataItem> & {
  search: string;
  onSearch: (value: string) => void;
};

export default function useRiversSearch(
  initialInput = '',
  onSelect?: (river: NamedNode) => void,
): Result {
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

  const sections: SectionListData<RiversListDataItem>[] = [];

  if (search) {
    sections.push({
      id: 'screens:addSection.river.newSubheader',
      data: [{ __typename: 'AddNewRiverItem', id: NEW_RIVER_ID, name: search }],
    });

    if (loading) {
      sections.push({
        id: 'screens:addSection.river.resultsSubheader',
        data: [{ __typename: 'Loading', id: 'loading' }],
      });
    } else if (data?.rivers.nodes.length) {
      sections.push({
        id: 'screens:addSection.river.resultsSubheader',
        data: data.rivers.nodes,
      });
    } else {
      sections.push({
        id: 'screens:addSection.river.resultsSubheader',
        data: [
          {
            __typename: 'NotFound',
            id: 'screens:addSection.river.listNotFound',
          },
        ],
      });
    }
  } else {
    sections.push({
      id: 'screens:addSection.river.resultsSubheader',
      data: [
        { __typename: 'NotFound', id: 'screens:addSection.river.listNoInput' },
      ],
    });
  }

  return {
    search: input,
    onSearch: setInput,
    keyExtractor: (item) => item.id,
    sections,
    renderSectionHeader: ({ section }) => (
      <RiversListSection id={section.id} key={section.id} />
    ),
    renderItem: ({ item }) => (
      <RiversListItem key={item.id} item={item} onSelect={onSelect} />
    ),
    ItemSeparatorComponent: RiversListSeparator,
    ListHeaderComponent: OfflineListHeader,
    // getItemLayout
  };
}
