import { type ReactNode, useMemo } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface MarkdownProps {
  children?: string | null;
}

type InlineKind = 'text' | 'bold' | 'italic' | 'code' | 'link';

interface InlineToken {
  kind: InlineKind;
  text: string;
  href?: string;
}

type BlockKind = 'paragraph' | 'heading' | 'list' | 'code';

interface MarkdownBlock {
  kind: BlockKind;
  text: string;
  level?: number;
  ordered?: boolean;
  items?: string[];
}

const INLINE_RE =
  /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;

function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(INLINE_RE)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      tokens.push({ kind: 'text', text: text.slice(lastIndex, index) });
    }
    if (match[2]) {
      tokens.push({ kind: 'bold', text: match[2] });
    } else if (match[3]) {
      tokens.push({ kind: 'italic', text: match[3] });
    } else if (match[4]) {
      tokens.push({ kind: 'code', text: match[4] });
    } else if (match[5] && match[6]) {
      tokens.push({ kind: 'link', text: match[5], href: match[6] });
    }
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push({ kind: 'text', text: text.slice(lastIndex) });
  }
  return tokens;
}

function parseBlocks(source: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (line.trim() === '') {
      index += 1;
      continue;
    }
    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith('```')) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) {
        index += 1;
      }
      blocks.push({ kind: 'code', text: codeLines.join('\n') });
      continue;
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      blocks.push({
        kind: 'heading',
        level: heading[1].length,
        text: heading[2],
      });
      index += 1;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items: string[] = [];
      while (index < lines.length) {
        const itemLine = lines[index];
        const bullet = ordered
          ? /^\s*\d+\.\s+(.*)$/.exec(itemLine)
          : /^\s*[-*]\s+(.*)$/.exec(itemLine);
        if (!bullet) {
          break;
        }
        items.push(bullet[1]);
        index += 1;
      }
      blocks.push({ kind: 'list', text: '', ordered, items });
      continue;
    }
    const paragraph: string[] = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() !== '' &&
      !lines[index].startsWith('#') &&
      !lines[index].startsWith('```') &&
      !/^\s*[-*]\s+/.test(lines[index]) &&
      !/^\s*\d+\.\s+/.test(lines[index])
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push({ kind: 'paragraph', text: paragraph.join(' ') });
  }
  return blocks;
}

function openHref(href: string) {
  Linking.openURL(href).catch(() => {
    /* Ignore */
  });
}

interface InlineTextProps {
  text: string;
  heading?: boolean;
}

function InlineText({ text, heading }: InlineTextProps) {
  const theme = useTheme();
  const tokens = tokenizeInline(text);
  return (
    <ThemedText type={heading ? 'subtitle' : 'default'}>
      {tokens.map((token, tokenIndex) => {
        if (token.kind === 'bold') {
          return (
            <Text key={tokenIndex} style={styles.bold}>
              {token.text}
            </Text>
          );
        }
        if (token.kind === 'italic') {
          return (
            <Text key={tokenIndex} style={styles.italic}>
              {token.text}
            </Text>
          );
        }
        if (token.kind === 'code') {
          return (
            <Text
              key={tokenIndex}
              style={[styles.inlineCode, { color: theme.textSecondary }]}
            >
              {token.text}
            </Text>
          );
        }
        if (token.kind === 'link' && token.href) {
          const href = token.href;
          return (
            <Text
              key={tokenIndex}
              style={[styles.link, { color: theme.primary }]}
              onPress={() => openHref(href)}
            >
              {token.text}
            </Text>
          );
        }
        return <Text key={tokenIndex}>{token.text}</Text>;
      })}
    </ThemedText>
  );
}

function Markdown({ children }: MarkdownProps) {
  const theme = useTheme();
  const source = children ?? '';
  const blocks = useMemo(() => parseBlocks(source), [source]);

  if (!source) {
    return null;
  }

  const content: ReactNode[] = blocks.map((block, index) => {
    if (block.kind === 'heading') {
      return (
        <InlineText
          key={index}
          text={block.text}
          heading
        />
      );
    }
    if (block.kind === 'code') {
      return (
        <View
          key={index}
          style={[
            styles.codeBlock,
            { backgroundColor: theme.backgroundElement },
          ]}
        >
          <ThemedText type="code">{block.text}</ThemedText>
        </View>
      );
    }
    if (block.kind === 'list') {
      return (
        <View key={index} style={styles.list}>
          {block.items?.map((item, itemIndex) => (
            <View key={itemIndex} style={styles.listItem}>
              <ThemedText type="default">
                {block.ordered ? `${itemIndex + 1}. ` : '• '}
              </ThemedText>
              <View style={styles.listItemBody}>
                <InlineText text={item} />
              </View>
            </View>
          ))}
        </View>
      );
    }
    return <InlineText key={index} text={block.text} />;
  });

  return <View style={styles.root}>{content}</View>;
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.two,
  },
  bold: {
    fontWeight: '700',
  },
  italic: {
    fontStyle: 'italic',
  },
  inlineCode: {
    fontFamily: Fonts.mono,
    fontSize: 14,
  },
  link: {
    textDecorationLine: 'underline',
  },
  codeBlock: {
    padding: Spacing.two,
    borderRadius: Spacing.one,
  },
  list: {
    gap: Spacing.one,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listItemBody: {
    flex: 1,
  },
});

export default Markdown;
