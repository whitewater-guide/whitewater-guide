import { useNavigation } from '@react-navigation/native';
import {
  LIST_SECTIONS,
  ListSectionsResult,
  ListSectionsVars,
  useSectionsFilterOptionsSetter,
} from '@whitewater-guide/clients';
import { applySearch } from '@whitewater-guide/commons';
import React, { useCallback, useMemo } from 'react';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import { SearchState } from './types';
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
  }, [terms, setSearchState]);
  const { data } = useQuery<ListSectionsResult, ListSectionsVars>(
    LIST_SECTIONS,
    { fetchPolicy: 'cache-only', variables: { filter: { regionId } } },
  );
  let count = 0;
  if (data && data.sections) {
    const filteredSections = applySearch(data.sections.nodes, terms);
    count = filteredSections.length;
  }
  return (
    <Button mode="contained" onPress={onPress} style={styles.button}>
      {t('filter:search', { count })}
    </Button>
  );
};
