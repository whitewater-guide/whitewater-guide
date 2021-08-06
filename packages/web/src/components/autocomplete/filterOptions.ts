import { NamedNode } from '@whitewater-guide/schema';
import deburr from 'lodash/deburr';
import take from 'lodash/take';

import { AutocompleteFilterOptions } from './types';

const defaultMatcher = (input: string | null, option: NamedNode) => {
  if (!input) {
    return true;
  }
  const i = deburr(input.trim()).toLowerCase();
  const o = deburr(option.name.trim()).toLowerCase();
  return o.includes(i);
};

const noMatcher = () => true;

const filterOptions = <T extends NamedNode>(
  options: T[],
  input: string | null,
  settings: AutocompleteFilterOptions = {},
) => {
  const { limit = Number.MAX_SAFE_INTEGER, matchInput = defaultMatcher } =
    settings;
  const matcher = matchInput === true ? noMatcher : matchInput;
  return take(
    options.filter((o) => matcher(input, o)),
    limit,
  );
};

export default filterOptions;
