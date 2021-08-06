import { SuggestionStatus } from '@whitewater-guide/schema';

export default (
  array: SuggestionStatus[],
  value: SuggestionStatus,
  included: boolean,
) => {
  if (!included) {
    return array.filter((v) => v !== value);
  }
  return array.includes(value) ? array : [...array, value];
};
