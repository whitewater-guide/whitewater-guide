declare module 'draft-js-import-markdown' {
  import { ContentState } from 'draft-js';
  export default function stateFromMarkdown(markdown: string): ContentState;
}
