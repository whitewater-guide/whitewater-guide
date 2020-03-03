import { ColorStrings } from '@whitewater-guide/clients';
import deepmerge from 'deepmerge';
import Attributes from 'markdown-it-attrs';
import React from 'react';
import { Platform, StyleProp, StyleSheet, Text } from 'react-native';
import SimpleMarkdown, {
  getUniqueID,
  PluginContainer,
  RenderRules,
} from 'react-native-markdown-display';
import theme from '../theme';

const defaultStyles: StyleSheet.NamedStyles<any> = StyleSheet.create({
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

const plugins = [new PluginContainer(Attributes)];

const rules: RenderRules = {
  strong: (node, children) => {
    let style: StyleProp<any> = defaultStyles.strong;
    if (node.attributes && node.attributes.color) {
      style = [style, defaultStyles[`level${node.attributes.color}`]];
    }
    return (
      <Text key={getUniqueID()} style={style}>
        {children}
      </Text>
    );
  },
  hardbreak: () => {
    return <Text key={getUniqueID()}>{'\n'}</Text>;
  },
};

interface Props {
  styles?: StyleSheet.NamedStyles<any>;
}

const Markdown: React.FC<Props> = ({ children, styles }) => {
  const actualStyles: any = styles
    ? deepmerge(StyleSheet.flatten(defaultStyles), styles)
    : defaultStyles;
  return (
    <SimpleMarkdown rules={rules} style={actualStyles} plugins={plugins}>
      {children}
    </SimpleMarkdown>
  );
};

export default Markdown;
