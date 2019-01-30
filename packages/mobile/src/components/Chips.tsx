import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Subheading } from 'react-native-paper';
import { NamedNode } from '@whitewater-guide/commons';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  label: {
    height: 32,
    paddingRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props {
  items: NamedNode[];
  label?: string;
}

export const Chips: React.StatelessComponent<Props> = ({ items, label }) => {
  return (
    <View style={styles.container}>
      {!!label && (
        <View style={styles.label}>
          <Subheading>{label}</Subheading>
        </View>
      )}
      {items && items.map(({ id, name }) => <Chip key={id}>{name}</Chip>)}
    </View>
  );
};
