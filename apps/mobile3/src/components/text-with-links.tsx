import { memo, useCallback, type ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet, Text } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export interface LinkNode {
  index: number;
  text?: string;
}

const LINK_RE = /\[([^\]]*)\]\((\d+)\)/g;

function split(text: string): Array<string | LinkNode> {
  const nodes: Array<string | LinkNode> = [];
  let lastIndex = 0;
  for (const match of text.matchAll(LINK_RE)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }
    nodes.push({ index: Number(match[2]), text: match[1] });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

export interface LinkProps {
  index: number;
  onLink: (index: number) => void;
  style?: StyleProp<TextStyle>;
  children?: ReactNode;
}

function Link({ index, onLink, style, children }: LinkProps) {
  const onPress = useCallback(() => {
    onLink(index);
  }, [index, onLink]);
  return (
    <Text style={style} onPress={onPress}>
      {children}
    </Text>
  );
}

export interface TextWithLinksProps {
  children: string;
  onLink: (index: number) => void;
  textStyle?: StyleProp<TextStyle>;
  linkStyle?: StyleProp<TextStyle>;
}

function TextWithLinks({
  onLink,
  children,
  textStyle,
  linkStyle,
}: TextWithLinksProps) {
  const theme = useTheme();
  const nodes = split(children);
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
            style={[styles.link, { color: theme.primary }, linkStyle]}
          >
            {node.text}
          </Link>
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  link: {},
});

export default memo(TextWithLinks);
