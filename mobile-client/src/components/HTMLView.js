import React from 'react';
import { StyleSheet, View } from 'react-native';
import HTML from 'react-native-htmlview';

const styles = StyleSheet.create({
  htmlView: {
    padding: 8,
  },
  p: {
    marginBottom: 8,
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
    {...props}
  />
);
