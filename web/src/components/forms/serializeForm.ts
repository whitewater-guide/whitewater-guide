import { stateToMarkdown } from 'draft-js-export-markdown';
import { mapValues } from 'lodash';

export const serializeForm = (markdownFields: string[], connections: string[] = []) => (input?: object | null) => {
  if (!input) {
    return null;
  }
  return mapValues(input, (value: any, key: string) => {
    if (markdownFields.includes(key)) {
      return value ? stateToMarkdown(value.getCurrentContent()).trim() : null;
    } else if (connections.includes(key)) {
      return value.map((item: any) => ({ id: item.id }));
    }
    return value;
  }) as {[key: string]: any};
};
