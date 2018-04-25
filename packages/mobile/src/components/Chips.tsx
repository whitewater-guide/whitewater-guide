import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Subheading } from 'react-native-paper';
import theme from '../theme';
import { NamedNode } from '../ww-commons/core';
import { Chip } from './Chip';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginVertical: theme.margin.half,
    marginRight: theme.margin.single,
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
      {!!label && <View style={styles.label}><Subheading>{label}</Subheading></View>}
      {items && items.map(({ id, name }) => (<Chip key={id} label={name} style={styles.chip} />))}
    </View>
  );
};
