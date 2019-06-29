import {
  LIST_SECTIONS,
  ListSectionsResult,
  ListSectionsVars,
  useFilterSetteer,
} from '@whitewater-guide/clients';
import { applySearch } from '@whitewater-guide/commons';
import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import React, { useCallback, useMemo } from 'react';
import { Query } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { SearchState } from './types';
import { stateToSearchTerms } from './utils';

const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
  },
});

interface Props {
  searchState: SearchState;
  regionId: string;
}

export const FindButton: React.FC<Props> = ({ searchState, regionId }) => {
  const terms = useMemo(() => stateToSearchTerms(searchState), [searchState]);
  const [t] = useTranslation();
  const { goBack } = useNavigation();
  const setSearchState = useFilterSetteer();
  const onPress = useCallback(() => {
    setSearchState(terms);
    goBack();
  }, [terms, setSearchState]);
  const variables = useMemo(() => ({ filter: { regionId } }), [regionId]);
  return (
    <Query<ListSectionsResult, ListSectionsVars>
      query={LIST_SECTIONS}
      variables={variables}
    >
      {({ data }) => {
        let count = 0;
        if (data) {
          const filteredSections = applySearch(data.sections.nodes, terms);
          count = filteredSections.length;
        }
        return (
          <Button mode="contained" onPress={onPress} style={styles.button}>
            {t('filter:search', { count })}
          </Button>
        );
      }}
    </Query>
  );
};
