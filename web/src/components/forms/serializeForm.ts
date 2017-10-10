import { stateToMarkdown } from 'draft-js-export-markdown';
import { mapValues } from 'lodash';

export const serializeForm = (markdownFields: string[]) => (input?: object | null) => {
  if (!input) {
    return null;
  }
  return mapValues(input, (value: any, key: string) => {
    if (markdownFields.includes(key)) {
      return value ? stateToMarkdown(value.getCurrentContent()).trim() : null;
    }
    return value;
  });
};
