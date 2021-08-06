import MarkdownIt from 'markdown-it';
import React, { useCallback } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

import theme from '../theme';

const parser = new MarkdownIt();

interface LinkNode {
  index: number;
  text?: string;
}

const split = (text: string) => {
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
};

const styles = StyleSheet.create({
  link: {
    color: theme.colors.primary,
  },
});

interface LinkProps {
  index: number;
  onLink: (index: number) => void;
  style?: StyleProp<TextStyle>;
}

const Link: React.FC<LinkProps> = ({ index, onLink, style, children }) => {
  const onPress = useCallback(() => {
    onLink(index);
  }, [index, onLink]);
  return (
    <Text style={[styles.link, style]} onPress={onPress}>
      {children}
    </Text>
  );
};

interface Props {
  children: string;
  onLink: (index: number) => void;
  textStyle?: StyleProp<TextStyle>;
  linkStyle?: StyleProp<TextStyle>;
}

export const TextWithLinks: React.FC<Props> = React.memo(
  ({ onLink, children, textStyle, linkStyle }) => {
    const nodes = split(children);
    // There's nothing else to use as key
    /* eslint-disable react/no-array-index-key */
    return (
      <Text>
        {nodes.map((node, index) => {
          if (typeof node === 'string') {
            return (
              <Text key={index} style={textStyle}>
                {node}
              </Text>
            );
          }
          return (
            <Link
              key={index}
              index={node.index}
              onLink={onLink}
              style={linkStyle}
            >
              {node.text}
            </Link>
          );
        })}
      </Text>
    );
    /* eslint-enable react/no-array-index-key */
  },
);

TextWithLinks.displayName = 'TextWithLinks';

export default TextWithLinks;
