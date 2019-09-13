import MarkdownIt from 'markdown-it';
import React, { useCallback } from 'react';
import { StyleSheet, Text } from 'react-native';
import theme from '../theme';

const parser = new MarkdownIt();

interface LinkNode {
  index?: number;
  text?: string;
}

const split = (text: string) => {
  const [root] = parser.parseInline(text, undefined);

  const nodes: Array<string | LinkNode> = [];
  let currentLink: LinkNode | null = null;
  root.children.forEach((child) => {
    if (child.type === 'text') {
      if (currentLink) {
        currentLink.text = child.content;
      } else {
        nodes.push(child.content);
      }
    } else if (child.type === 'link_open') {
      currentLink = { index: parseInt(child.attrGet('href')!, 10) };
    } else if (child.type === 'link_close') {
      nodes.push(currentLink!);
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

interface Props {
  children: string;
  onLink: (index: number) => void;
}

const Link: React.FC<{ index: number; onLink: (index: number) => void }> = ({
  index,
  onLink,
  children,
}) => {
  const onPress = useCallback(() => {
    onLink(index);
  }, [index, onLink]);
  return (
    <Text style={styles.link} onPress={onPress}>
      {children}
    </Text>
  );
};

export const TextWithLinks: React.FC<Props> = React.memo(
  ({ onLink, children }) => {
    const nodes = split(children);
    return (
      <Text>
        {nodes.map((node, index) => {
          if (typeof node === 'string') {
            return <Text key={index}>{node}</Text>;
          }
          return (
            <Link key={index} index={node.index!} onLink={onLink}>
              {node.text}
            </Link>
          );
        })}
      </Text>
    );
  },
);

TextWithLinks.displayName = 'TextWithLinks';

export default TextWithLinks;
