import { NEW_ID } from '@whitewater-guide/commons';

export function dataIdFromObject(result: any) {
  if (result.__typename) {
    if (result.id !== undefined && result.id !== NEW_ID) {
      return `${result.__typename}:${result.id}`;
    }
  }
  return null;
}
