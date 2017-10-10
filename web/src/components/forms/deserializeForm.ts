import { EditorState } from 'draft-js';
import { stateFromMarkdown } from 'draft-js-import-markdown';
import { mapValues, omit } from 'lodash';

export const deserializeForm = (markdownFields: string[] = [], objectFields: string[] = []) =>
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
        return value.map(item => omit(item, ['__typename', 'language', 'createdAt', 'updatedAt']));
      } else {
        return omit(value, ['__typename', 'language', 'createdAt', 'updatedAt']);
      }
    }
    return value;
  });
};
