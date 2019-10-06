import { NamedNode } from '@whitewater-guide/commons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Subheading } from 'react-native-paper';
import theme from '../theme';

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
  chip: {
    marginRight: theme.margin.half,
    marginBottom: theme.margin.half,
  },
});

interface Props {
  items: NamedNode[];
  label?: string;
}

const Chips: React.FC<Props> = ({ items, label }) => {
  return (
    <View style={styles.container}>
      {!!label && (
        <View style={styles.label}>
          <Subheading>{label}</Subheading>
        </View>
      )}
      {items &&
        items.map(({ id, name }) => (
          <Chip key={id} style={styles.chip}>
            {name}
          </Chip>
        ))}
    </View>
  );
};

export default Chips;
