import React from 'react';
import { EnrichedMarkdownText } from 'react-native-enriched-markdown';

interface Props {
  children?: string | null;
}

function Markdown({ children }: Props) {
  return <EnrichedMarkdownText markdown={children ?? ''} />;
}

export default Markdown;
