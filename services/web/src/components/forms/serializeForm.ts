import { toMarkdown } from '@whitewater-guide/md-editor';
import mapValues from 'lodash/mapValues';

/**
 * Convert form data into graphql mutation input
 * @param {string[]} markdownFields Fields that must be converted from draft.js internal
 * representation to markdown strings
 * @param {string[]} refs one-to-one connections, should be reduced to { id } objects
 * @param {string[]} connections one-to-many connections, should be reduced to [ { id }, { id } ] arrays
 * @returns {(input?: (object | null)) => (any | {[p: string]: any})} serializer function
 */
export const serializeForm = (
  markdownFields: string[] = [],
  refs: string[] = [],
  connections: string[] = [],
) => (input?: object | null) => {
  if (!input) {
    return null;
  }
  return mapValues(input, (value: any, key: string) => {
    if (markdownFields.includes(key)) {
      return value ? toMarkdown(value) : null;
    } else if (refs.includes(key)) {
      return value ? { id: value.id } : null;
    } else if (connections.includes(key)) {
      return value.map((item: any) => ({ id: item.id }));
    }
    return value;
  }) as { [key: string]: any };
};
