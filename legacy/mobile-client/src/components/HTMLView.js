import React from 'react';
import { StyleSheet, View } from 'react-native';
import HTML from 'react-native-htmlview';
import theme from '../theme';

const styles = StyleSheet.create({
  htmlView: {
    padding: 8,
  },
  p: {
    marginBottom: 8,
  },
});

const htmlStyles = StyleSheet.create({
  a: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});

const renderNode = (node, index, siblings, parent, defaultRenderer) => {
  if (node.name === 'p') {
    return (
      <View style={styles.p}>
        { defaultRenderer(node.children, node) }
      </View>
    );
  }
  return undefined;
};

export default props => (
  <HTML
    style={styles.htmlView}
    addLineBreaks={false}
    renderNode={renderNode}
    stylesheet={htmlStyles}
    {...props}
  />
);
