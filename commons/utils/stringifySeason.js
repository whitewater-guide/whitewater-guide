import moment from 'moment';
import { times } from 'lodash';

function halfMonth(n) {
  const name = moment().month(Math.floor(n / 2)).format('MMMM');
  const prefix = (n % 2 === 0) ? 'early' : 'late';
  return `${prefix} ${name}`;
}

function rangeToStr(range) {
  const start = range[0] % 24;
  const end = range[1] % 24;
  if (isNaN(end)) {
    return halfMonth(start);
  } else if (start % 2 === 0 && end === start + 1) {
    return moment().month(start / 2).format('MMMM');
  }
  const startName = moment().month(Math.floor(start / 2)).format('MMMM');
  const endName = moment().month(Math.floor(end / 2)).format('MMMM');
  if (start % 2 === 0 && end % 2 === 1) {
    return `${startName} - ${endName}`;
  }
  return `${halfMonth(start)} - ${halfMonth(end)}`;
}

/**
 * Stringifies season
 * @seasonNumeric - array of numeric half-months
 * @range - If true, seasonNumeric is considered to be a range, otherwise - just set of half-months
 */
export default function stringifySeason(seasonNumeric, range = false) {
  if (!seasonNumeric || seasonNumeric.length === 0) {
    return '';
  } 
  let seasons = [...seasonNumeric];
  if (range && seasonNumeric.length === 2) {
    seasons = times(seasonNumeric[1] - seasonNumeric[0] + 1, i => seasonNumeric[0] + i );
  }
  if (seasons.length === 24) {
    return 'all year around';
  }
  // Loop around new year
  let shift = 0;
  if (seasonNumeric.indexOf(0) === 0 && seasonNumeric.indexOf(23) >= 0) {
    const tail = [];
    while (seasonNumeric[shift] === shift) {
      tail.push(shift + 24);
      shift += 1;
    }
    seasons.splice(0, shift);
    seasons = seasons.concat(tail);
  }
  const ranges = [];
  let currentRange = [];
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

