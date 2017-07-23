import React from 'react';
import { StyleSheet, Text } from 'react-native';
import SimpleMarkdown, { AstRenderer, defaultRenderFunctions, PluginContainer } from 'react-native-markdown-renderer';
import Attributes from 'markdown-it-attrs';
import { ColorStrings } from '../commons/features/sections';
import theme from '../theme';

const plugins = [
  new PluginContainer(Attributes, 'block', {}),
];

const renderer = new AstRenderer({
  ...defaultRenderFunctions,
  strong: (node, children, parents, styles) => {
    let style = styles.strong;
    if (node.attributes && node.attributes.color) {
      style = [style, styles[`level${node.attributes.color}`]];
    }
    return (
      <Text key={AstRenderer.getUniqueID()} style={style}>
        {children}
      </Text>
    );
  },
});

const styles = StyleSheet.create({
  a: {
    color: theme.colors.primary,
  },
  strong: {
    fontWeight: 'bold',
  },
  level0: {
    color: ColorStrings.dry,
  },
  level1: {
    color: ColorStrings.minimum,
  },
  level2: {
    color: ColorStrings.optimum,
  },
  level3: {
    color: ColorStrings.maximum,
  },
  level4: {
    color: ColorStrings.impossible,
  },
});

export const Markdown = ({ children }) => (
  <SimpleMarkdown renderer={renderer} styles={styles} plugins={plugins}>
    {children}
  </SimpleMarkdown>
);
