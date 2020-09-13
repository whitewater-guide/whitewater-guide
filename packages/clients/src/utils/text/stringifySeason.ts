import times from 'lodash/times';

import { getMonthName } from '../../i18n/getMonthName';

type Range = [number, number];

export interface SeasonLocalizer {
  (key: 'all'): string;
  (key: 'early' | 'late', halfMonth: number): string;
}

const defaultLocalize: SeasonLocalizer = (key: any, hm?: any) => {
  if (key === 'early') {
    return 'early ' + getMonthName(Math.floor(hm / 2));
  }
  if (key === 'late') {
    return 'late ' + getMonthName(Math.floor(hm / 2));
  }
  return 'all year around';
};

function halfMonth(n: number, localize: SeasonLocalizer): string {
  const isEarly = n % 2 === 0;
  return isEarly ? localize('early', n) : localize('late', n);
}

function rangeToStr(range: Range, localize: SeasonLocalizer): string {
  const start = range[0] % 24;
  const end = range[1] % 24;
  if (isNaN(end)) {
    return halfMonth(start, localize);
  } else if (start % 2 === 0 && end === start + 1) {
    return getMonthName(start / 2);
  }
  let startName = getMonthName(Math.floor(start / 2));
  let endName = getMonthName(Math.floor(end / 2));
  if (start % 2 !== 0) {
    startName = halfMonth(start, localize);
  }
  if (end % 2 !== 1) {
    endName = halfMonth(end, localize);
  }
  return `${startName} - ${endName}`;
}

function loopAroundNewYear(seasons: number[]): number[] {
  const tail = [];
  let shift = 0;
  let result = [...seasons];
  while (seasons[shift] === shift) {
    tail.push(shift + 24);
    shift += 1;
  }
  result.splice(0, shift);
  result = result.concat(tail);
  return result;
}

/**
 * Stringifies season
 * @seasonNumeric - array of numeric half-months
 * @range - If true, seasonNumeric is considered to be a range (possibly, looping around new year, like (e.g. [22, 3])
 * @localize - Localization function
 * otherwise - just set of half-months
 */
export function stringifySeason(
  seasonNumeric?: number[],
  range = false,
  localize: (key: string) => string = defaultLocalize,
): string {
  if (!seasonNumeric || seasonNumeric.length === 0) {
    return '';
  }
  let seasons = [...seasonNumeric];
  if (range && seasonNumeric.length === 2) {
    seasons =
      seasonNumeric[0] <= seasonNumeric[1]
        ? times(
            seasonNumeric[1] - seasonNumeric[0] + 1,
            (i) => seasonNumeric[0] + i,
          )
        : times(seasonNumeric[1] + 1).concat(
            times(23 - seasonNumeric[0] + 1, (i) => seasonNumeric[0] + i),
          );
  }
  if (seasons.length === 24) {
    return localize('all');
  }
  // Loop around new year
  if (seasons.indexOf(0) === 0 && seasons.indexOf(23) >= 0) {
    seasons = loopAroundNewYear(seasons);
  }
  const ranges: Range[] = [];
  let currentRange: number[] = [];
  let prev = -1;
  const cnt = seasons.length;
  for (let i = 0; i < cnt; i += 1) {
    const hm = seasons[i];
    if (hm === prev + 1) {
      if (currentRange.length < 2) {
        currentRange.push(hm);
      } else {
        currentRange[1] = hm;
      }
    } else {
      if (currentRange.length > 0) {
        ranges.push(currentRange as Range);
      }
      currentRange = [hm];
    }
    prev = hm;
  }
  if (currentRange.length > 0) {
    ranges.push(currentRange as Range);
  }
  // Now we have array of single half-months or half-month pairs
  return ranges.map((r) => rangeToStr(r, localize)).join(', ');
}
