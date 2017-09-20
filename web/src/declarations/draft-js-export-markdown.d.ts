declare module 'draft-js-export-markdown' {
  import { ContentState } from 'draft-js';
  export default function stateToMarkdown(state: ContentState): string;
}
