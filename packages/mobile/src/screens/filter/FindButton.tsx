import { LIST_SECTIONS, RegionConsumer } from '@whitewater-guide/clients';
import {
  applySearch,
  Connection,
  Section,
  SectionSearchTerms,
} from '@whitewater-guide/commons';
import React, { useCallback } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
  },
});

interface Result {
  sections: Required<Connection<Section>>;
}

interface Props {
  terms: SectionSearchTerms;
  onApply: (terms: SectionSearchTerms) => void;
}

export const FindButton: React.FC<Props> = ({ terms, onApply }) => {
  const [t] = useTranslation();
  const onPress = useCallback(() => onApply(terms), [terms, onApply]);
  return (
    <ApolloConsumer>
      {(client) => (
        <RegionConsumer>
          {({ region }) => {
            const result: Result | null = client.cache.readQuery({
              query: LIST_SECTIONS,
              variables: { filter: { regionId: region.node!.id } },
            });
            let count = 0;
            if (result) {
              const filteredSections = applySearch(
                result.sections.nodes,
                terms,
              );
              count = filteredSections.length;
            }
            return (
              <Button mode="contained" onPress={onPress} style={styles.button}>
                {t('filter:search', { count })}
              </Button>
            );
          }}
        </RegionConsumer>
      )}
    </ApolloConsumer>
  );
};
