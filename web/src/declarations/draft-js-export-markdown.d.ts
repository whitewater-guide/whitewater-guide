declare module 'draft-js-export-markdown' {
  import { ContentState } from 'draft-js';
  export function stateToMarkdown(state: ContentState): string;
}
