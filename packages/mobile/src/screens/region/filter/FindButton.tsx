import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import type {
  ListSectionsQuery,
  ListSectionsQueryVariables,
} from '@whitewater-guide/clients';
import {
  applySearch,
  ListSectionsDocument,
  useSectionsFilterOptionsSetter,
} from '@whitewater-guide/clients';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import type { SearchState } from './types';
import { stateToFilterOptions } from './utils';

const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
  },
});

interface Props {
  searchState: SearchState;
  regionId?: string;
}

export const FindButton: React.FC<Props> = ({ searchState, regionId }) => {
  const terms = useMemo(() => stateToFilterOptions(searchState), [searchState]);
  const [t] = useTranslation();
  const { goBack } = useNavigation();
  const setSearchState = useSectionsFilterOptionsSetter();
  const onPress = useCallback(() => {
    setSearchState(terms);
    goBack();
  }, [terms, setSearchState, goBack]);

  const { data } = useQuery<ListSectionsQuery, ListSectionsQueryVariables>(
    ListSectionsDocument,
    { fetchPolicy: 'cache-only', variables: { filter: { regionId } } },
  );
  let count = 0;
  if (data?.sections) {
    const filteredSections = applySearch(data.sections.nodes, terms);
    count = filteredSections.length;
  }
  return (
    <Button mode="contained" onPress={onPress} style={styles.button}>
      {t('filter:search', { count })}
    </Button>
  );
};
