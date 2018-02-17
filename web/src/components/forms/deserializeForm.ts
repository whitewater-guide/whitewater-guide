import { EditorState } from 'draft-js';
import { stateFromMarkdown } from 'draft-js-import-markdown';
import { mapValues, omit } from 'lodash';

const cleanup = (value: any) => omit(value, ['__typename', 'language', 'createdAt', 'updatedAt']);

/**
 * Convert graphql query result into something that can be feed into form
 * @param {string[]} markdownFields Fields that come as markdown, will be converted to Draft.js format
 * @param {string[]} refs one-to-one connections, like section->river
 * @param {string[]} connections one-to-many connections, like source->regions.
 * Come in { nodes: [], count } object which must be unfolded
 * @returns {(input?: (object | null)) => (undefined | any)} Function to deserialize accoring to rules above
 */
export const deserializeForm =
  (markdownFields: string[] = [], refs: string[] = [], connections: string[] = []) =>
  (input?: object | null) => {
    if (!input) {
      return undefined;
    }
    const omitted = omit(input, ['__typename', 'language', 'createdAt', 'updatedAt']);
    return mapValues(omitted, (value: any, key: string) => {
      if (markdownFields.includes(key)) {
        return value ? EditorState.createWithContent(stateFromMarkdown(value)) : null;
      } else if (refs.includes(key)) {
        if (!value) {
          return null;
        } else if (Array.isArray(value)) {
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
