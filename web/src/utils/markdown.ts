import { EditorState } from 'draft-js';
import { stateToMarkdown } from 'draft-js-export-markdown';
import { stateFromMarkdown } from 'draft-js-import-markdown';

export function markdownToDraft(markdown: string) {
  return EditorState.createWithContent(stateFromMarkdown(markdown || ''));
}

export function draftToMarkdown(state: EditorState) {
  return state && stateToMarkdown(state.getCurrentContent());
}
