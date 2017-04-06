import moment from 'moment';

const ROMAN_NUMBERS = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

const DECIMAL_POINT = (1.1).toLocaleString().substr(1, 1);
let K_SEPARATOR = (5000).toLocaleString().substr(1, 1);
if (K_SEPARATOR === '0') {
  K_SEPARATOR = (DECIMAL_POINT === '.' ? ',' : '.');
}

export function toRomanDifficulty(decimalDifficulty) {
  if (Number.isInteger(decimalDifficulty)) {
    return ROMAN_NUMBERS[decimalDifficulty];
  }
  const floor = Math.floor(decimalDifficulty);
  return `${ROMAN_NUMBERS[floor]} - ${ROMAN_NUMBERS[floor + 1]}`;
}

export function renderDifficulty({ difficulty, difficultyXtra }) {
  let result = toRomanDifficulty(difficulty);
  if (difficultyXtra) {
    result = `${result} (${difficultyXtra})`;
  }
  return result;
}

/**
 * locale semi-agnostic string to float conversion
 * https://gist.github.com/GerHobbelt/2037124
 * @param str String with either "," or "." as decimal separator
 * @returns Number
 */
export function strToFloat(str) {
  switch (typeof (result)) {
    case 'float':
    case 'integer':
      return str;
    default: {
      let result = '' + str; // force str to be string type
      result = result.match(/[0-9.,eE-]+/);
      if (result) {
        result = result[0];
      } else {
        return Number.NaN; // VERY illegal number format
      }

      const kp = result.indexOf(',');
      const dp = result.indexOf('.');
      const kpl = result.lastIndexOf(',');
      const dpl = result.lastIndexOf('.');
      // can we be 'locale agnostic'? We can if both markers are in the input:
      if (kp > 0 && dp > 0) {
        if (kp < dp) {
          // e.g.: 1,000.00
          if (kpl > dpl || dpl > dp) {
            return Number.NaN; // VERY illegal number format
          }
          result = result.replace(/,/g, '');
        } else {
          // e.g.: 1.000,00
          if (kpl < dpl || kpl > kp) {
            return Number.NaN; // VERY illegal number format
          }
          result = result.replace(/\./g, '').replace(',', '.');
        }
      } else {
        // only one of 'em in there: must we use the detected 'current' locale
        // or can we 'heuristically determine' what's right here?
        // We can do the latter if we have either:
        // - only up to 2 digits following the only separator
        // - more than 3 digits following the only separator
        // - one separator only and the number starts with it, e.g. '.45'
        //
        // When we have only 3 digits following the last and only sep, we assume the separator
        // to be a 'thousands marker'.
        // We COULD fall back to the current locale, but than the ambiguous items receive
        // different treatment on a possibly incorrect locale setting (e.g. my machines are all
        // US/metric configured while I live in the Netherlands, but I /despise/ Dutch MS Excel,
        // for example. Riding the 'locale aware' ticket would definitely screw up my [ambiguous]
        // numbers. I believe it's better to be consistently wrong than semi-randomly correct.
        //
        // examples: 1.000 : 5,00 : 2,999.95 : 2,998 : 7.50 : 0,1791634 : 0.1791634 : .45 : ,32
        if (dp >= 0 && kp < 0) {
          // .45, ....
          if (dp !== 0 && (dpl > dp || result.substr(dp + 1).match(/^[0-9]{3}\b/))) {
            result = result.replace(/\./g, '');
          }
        } else if (kp >= 0 && dp < 0) {
          // ,32; ....
          if (kp !== 0 && (kpl > kp || result.substr(kp + 1).match(/^[0-9]{3}\b/))) {
            result = result.replace(/,/g, '');
          } else {
            result = result.replace(',', '.');
          }
        } else if (kp < 0 && dp < 0) {
          // integer value
        } else {
          // VERY illegal format, such as '.456,678'
          return Number.NaN;
        }
      }
      // now str has parseFloat() compliant format with US decimal point
      // only (iff it has a decimal fraction at all).
      return parseFloat(result);
    }
  }
}

export function stringifySeason(seasonNumeric) {
  
}
