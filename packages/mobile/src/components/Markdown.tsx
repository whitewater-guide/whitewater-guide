import { ColorStrings } from '@whitewater-guide/clients';
import Attributes from 'markdown-it-attrs';
import React from 'react';
import { Platform, StyleProp, StyleSheet, Text } from 'react-native';
import SimpleMarkdown, {
  getUniqueID,
  PluginContainer,
  RenderRules,
} from 'react-native-markdown-renderer';
import theme from '../theme';

type TStyle = ReturnType<typeof StyleSheet.create> & { [key: string]: any };

const styles: TStyle = StyleSheet.create({
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
    let style: StyleProp<any> = styles.strong;
    if (node.attributes && node.attributes.color) {
      style = [style, styles[`level${node.attributes.color}`]];
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

export const Markdown: React.FC = ({ children }) => (
  <SimpleMarkdown rules={rules} style={styles} plugins={plugins}>
    {children}
  </SimpleMarkdown>
);
