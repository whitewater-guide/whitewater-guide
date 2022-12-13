import { ColorStrings } from '@whitewater-guide/clients';
import deepmerge from 'deepmerge';
import Attributes from 'markdown-it-attrs';
import React, { FC, PropsWithChildren } from 'react';
import { Platform, StyleProp, StyleSheet, Text } from 'react-native';
import SimpleMarkdown, {
  MarkdownIt,
  RenderRules,
} from 'react-native-markdown-display';

import theme from '../theme';

const defaultStyles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  body: {
    color: theme.colors.textMain,
  },
  a: {
    color: theme.colors.primary,
  },
  strong: {
    fontWeight: 'bold',
  },
  level0: {
    color: ColorStrings.none,
  },
  level1: {
    color: ColorStrings.dry,
  },
  level2: {
    color: ColorStrings.minimum,
  },
  level3: {
    color: ColorStrings.optimum,
  },
  level4: {
    color: ColorStrings.maximum,
  },
  level5: {
    color: ColorStrings.impossible,
  },
  hardbreak: { height: 8, width: '100%' },
  listUnorderedItemIcon: {
    marginLeft: 10,
    marginRight: 10,
    ...Platform.select({
      ios: {
        lineHeight: 36,
      },
      android: {
        lineHeight: 40,
      },
    }),
  },
});

const markdownItInstance = MarkdownIt({ typographer: true }).use(Attributes);

const rules: RenderRules = {
  // eslint-disable-next-line react/display-name
  strong: (node, children) => {
    let style: StyleProp<any> = defaultStyles.strong;
    if (node.attributes?.color) {
      style = [style, defaultStyles[`level${node.attributes.color}`]];
    }
    return (
      <Text key={node.key} style={style}>
        {children}
      </Text>
    );
  },
  // eslint-disable-next-line react/display-name
  hardbreak: (node) => {
    return (
      <Text key={node.key} style={defaultStyles.hardbreak}>
        {'\n'}
      </Text>
    );
  },
};

interface Props {
  styles?: StyleSheet.NamedStyles<any>;
}

const Markdown: FC<PropsWithChildren<Props>> = ({ children, styles }) => {
  const actualStyles: any = styles
    ? deepmerge(StyleSheet.flatten(defaultStyles), styles)
    : defaultStyles;

  return (
    <SimpleMarkdown
      rules={rules}
      style={actualStyles}
      markdownit={markdownItInstance}
    >
      {children}
    </SimpleMarkdown>
  );
};

export default Markdown;
