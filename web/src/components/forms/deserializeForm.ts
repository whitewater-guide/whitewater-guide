import { EditorState } from 'draft-js';
import { stateFromMarkdown } from 'draft-js-import-markdown';
import { mapValues, omit } from 'lodash';

const cleanup = (value: any) => omit(value, ['__typename', 'language', 'createdAt', 'updatedAt']);

export const deserializeForm =
  (markdownFields: string[] = [], objectFields: string[] = [], connections: string[] = []) =>
  (input?: object | null) => {
    if (!input) {
      return undefined;
    }
    const omitted = omit(input, ['__typename', 'language', 'createdAt', 'updatedAt']);
    return mapValues(omitted, (value: any, key: string) => {
      if (markdownFields.includes(key)) {
        return value ? EditorState.createWithContent(stateFromMarkdown(value)) : null;
      } else if (objectFields.includes(key)) {
        if (Array.isArray(value)) {
          return value.map(cleanup);
        } else {
          return cleanup(value);
        }
      } else if (connections.includes(key)) {
        return value.nodes ? value.nodes.map(cleanup) : [];
      }
      return value;
    });
};
