import { times } from 'lodash';
import * as moment from 'moment';

function halfMonth(n: number): string {
  const name = moment().month(Math.floor(n / 2)).format('MMMM');
  const prefix = (n % 2 === 0) ? 'early' : 'late';
  return `${prefix} ${name}`;
}

function rangeToStr(range: [number, number]): string {
  const start = range[0] % 24;
  const end = range[1] % 24;
  if (isNaN(end)) {
    return halfMonth(start);
  } else if (start % 2 === 0 && end === start + 1) {
    return moment().month(start / 2).format('MMMM');
  }
  let startName = moment().month(Math.floor(start / 2)).format('MMMM');
  let endName = moment().month(Math.floor(end / 2)).format('MMMM');
  if (start % 2 !== 0) {
    startName = halfMonth(start);
  }
  if (end % 2 !== 1) {
    endName = halfMonth(end);
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
 * otherwise - just set of half-months
 */
export function stringifySeason(seasonNumeric?: number[], range: boolean = false): string {
  if (!seasonNumeric || seasonNumeric.length === 0) {
    return '';
  }
  let seasons = [...seasonNumeric];
  if (range && seasonNumeric.length === 2) {
    seasons = seasonNumeric[0] <= seasonNumeric[1] ?
      times(seasonNumeric[1] - seasonNumeric[0] + 1, i => seasonNumeric[0] + i) :
      times(seasonNumeric[1] + 1).concat(times(23 - seasonNumeric[0] + 1, i => seasonNumeric[0] + i));
  }
  if (seasons.length === 24) {
    return 'all year around';
  }
  // Loop around new year
  if (seasons.indexOf(0) === 0 && seasons.indexOf(23) >= 0) {
    seasons = loopAroundNewYear(seasons);
  }
  const ranges = [];
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
        ranges.push(currentRange);
      }
      currentRange = [hm];
    }
    prev = hm;
  }
  if (currentRange.length > 0) {
    ranges.push(currentRange);
  }
  // Now we have array of single half-months or half-month pairs
  return ranges.map(rangeToStr).join(', ');
}
