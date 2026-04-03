import MarkdownIt from 'markdown-it';
import React, { memo, useCallback } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet, Text } from 'react-native';

import theme from '../theme';

const parser = new MarkdownIt();

interface LinkNode {
  index: number;
  text?: string;
}

function split(text: string): Array<string | LinkNode> {
  const [root] = parser.parseInline(text, undefined);
  const nodes: Array<string | LinkNode> = [];
  let currentLink: LinkNode | null = null;
  root.children?.forEach((child) => {
    if (child.type === 'text') {
      if (currentLink) {
        currentLink.text = child.content;
      } else {
        nodes.push(child.content);
      }
    } else if (child.type === 'link_open') {
      const href = child.attrGet('href');
      if (href) {
        currentLink = { index: parseInt(href, 10) };
      }
    } else if (child.type === 'link_close' && currentLink) {
      nodes.push(currentLink);
      currentLink = null;
    }
  });
  return nodes;
}

const styles = StyleSheet.create({
  link: {
    color: theme.colors.primary,
  },
});

interface LinkProps {
  index: number;
  onLink: (index: number) => void;
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

function Link({ index, onLink, style, children }: LinkProps) {
  const onPress = useCallback(() => {
    onLink(index);
  }, [index, onLink]);
  return (
    <Text style={[styles.link, style]} onPress={onPress}>
      {children}
    </Text>
  );
}

interface Props {
  children: string;
  onLink: (index: number) => void;
  textStyle?: StyleProp<TextStyle>;
  linkStyle?: StyleProp<TextStyle>;
}

function TextWithLinks({ onLink, children, textStyle, linkStyle }: Props) {
  const nodes = split(children);
  // eslint-disable-next-line react/no-array-index-key
  return (
    <Text>
      {nodes.map((node, index) => {
        if (typeof node === 'string') {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Text key={index} style={textStyle}>
              {node}
            </Text>
          );
        }
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Link key={index} index={node.index} onLink={onLink} style={linkStyle}>
            {node.text}
          </Link>
        );
      })}
    </Text>
  );
}

export default memo(TextWithLinks);
