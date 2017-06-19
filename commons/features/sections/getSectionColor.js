/* eslint no-bitwise: 0 */
import color from 'color';
import { isFunction, mapValues } from 'lodash';

// Color scheme is discussed here: https://github.com/doomsower/whitewater/issues/45
// Basically, we process every possible combination of present/absent minimum,optimum, maximum and impossible levels
// This makes 16 combinations, or rows
// If minimum is present, we also compute 'absolute' minimum
// Then after we determinted row we check in which interval the value falls - this is column
// Then we fin cell value in colorTable
// If it is color we just return it
// If it is null, we approximate between colors of this interval edges
// If it is function, we use it to compute. Functions are used to approximate values in double intervals
// (e.g. OPT and IMP are given, but MAX is missing)
export const Colors = {
  none: color.hsl(0, 0, 40),
  dry: color.hsl(240, 100, 20),
  minimum: color.hsl(240, 100, 50),
  optimum: color.hsl(120, 100, 50),
  maximum: color.hsl(0, 100, 50),
  impossible: color.hsl(0, 100, 30),
};

export const ColorStrings = mapValues(Colors, clr => clr.hsl().string());

export const getColorForValue = (value, binding, defaultColor) => {
  if (!binding) {
    return defaultColor;
  }
  const { minimum, maximum, optimum, impossible } = binding;
  if (value === minimum) {
    return ColorStrings.minimum;
  } else if (value === optimum) {
    return ColorStrings.optimum;
  } else if (value === maximum) {
    return ColorStrings.maximum;
  } else if (value === impossible) {
    return ColorStrings.impossible;
  }
  return defaultColor;
};

// a.k.a. "absolute minimum"
export function getDryLevel({ minimum, maximum, optimum, impossible }) {
  if (!minimum) {
    return 0;
  } else if (optimum) {
    return minimum - (optimum - minimum) / 5;
  } else if (maximum) {
    return minimum - (maximum - minimum) / 10;
  } else if (impossible) {
    return minimum - (impossible - minimum) / 20;
  }
  return 0.7 * minimum;
}

function getRow({ minimum, maximum, optimum, impossible }) {
  let result = 0;
  if (minimum) {
    result |= 8;
  }
  if (optimum) {
    result |= 4;
  }
  if (maximum) {
    result |= 2;
  }
  if (impossible) {
    result |= 1;
  }
  return result;
}

function getCol({ dry, minimum, maximum, optimum, impossible, lastValue }) {
  if (lastValue <= dry) {
    return 0;
  } else if (minimum && lastValue < minimum) {
    return 1;
  } else if (optimum && lastValue < optimum) {
    return 2;
  } else if (maximum && lastValue < maximum) {
    return 3;
  } else if (impossible && lastValue < impossible) {
    return 4;
  }
  return 5;
}

export function hslMix(color1, color2, ratio = 0.5) {
  const [h1, s1, l1] = color1.hsl().array();
  const [h2, s2, l2] = color2.hsl().array();
  const dh = h2 - h1;
  const ds = s2 - s1;
  const dl = l2 - l1;
  return color.hsl([h1 + dh * ratio, s1 + ds * ratio, l1 + dl * ratio]);
}

function mix(col, { dry, minimum, maximum, optimum, impossible, lastValue }) {
  switch (col) {
    case 0:
      return Colors.dry;
    case 1:
      return hslMix(Colors.dry, Colors.minimum, (lastValue - dry) / (minimum - dry));
    case 2:
      return hslMix(Colors.minimum, Colors.optimum, (lastValue - minimum) / (optimum - minimum));
    case 3:
      return hslMix(Colors.optimum, Colors.maximum, (lastValue - optimum) / (maximum - optimum));
    case 4:
      return hslMix(Colors.maximum, Colors.impossible, (lastValue - maximum) / (impossible - maximum));
    default:
      return Colors.impossible;
  }
}

const colorTable = {
  0: {
    0: Colors.none,
    1: Colors.none,
    2: Colors.none,
    3: Colors.none,
    4: Colors.none,
    5: Colors.none,
  },
  1: {
    0: Colors.none,
    1: Colors.none,
    2: Colors.none,
    3: Colors.none,
    4: Colors.none,
    5: Colors.impossible,
  },
  2: {
    0: Colors.none,
    1: Colors.none,
    2: Colors.none,
    3: Colors.none,
    4: Colors.maximum,
    5: Colors.maximum,
  },
  3: {
    0: Colors.none,
    1: Colors.none,
    2: Colors.none,
    3: Colors.none,
    4: null,
    5: Colors.impossible,
  },
  4: {
    0: Colors.none,
    1: Colors.none,
    2: Colors.none,
    3: Colors.none,
    4: Colors.none,
    5: Colors.none,
  },
  5: {
    0: Colors.none,
    1: Colors.none,
    2: Colors.none,
    3: ({ optimum, impossible, lastValue }) =>
      hslMix(Colors.optimum, Colors.impossible, (lastValue - optimum) / (impossible - optimum)),
    4: ({ optimum, impossible, lastValue }) =>
      hslMix(Colors.optimum, Colors.impossible, (lastValue - optimum) / (impossible - optimum)),
    5: Colors.impossible,
  },
  6: {
    0: Colors.none,
    1: Colors.none,
    2: Colors.none,
    3: null,
    4: Colors.maximum,
    5: Colors.maximum,
  },
  7: {
    0: Colors.none,
    1: Colors.none,
    2: Colors.none,
    3: null,
    4: null,
    5: Colors.impossible,
  },
  8: {
    0: Colors.dry,
    1: Colors.minimum,
    2: Colors.none,
    3: Colors.none,
    4: Colors.none,
    5: Colors.none,
  },
  9: {
    0: Colors.dry,
    1: null,
    2: Colors.none,
    3: Colors.none,
    4: Colors.none,
    5: Colors.impossible,
  },
  10: {
    0: Colors.dry,
    1: null,
    2: Colors.none,
    3: Colors.none,
    4: Colors.maximum,
    5: Colors.maximum,
  },
  11: {
    0: Colors.dry,
    1: null,
    2: Colors.none,
    3: Colors.none,
    4: null,
    5: Colors.impossible,
  },
  12: {
    0: Colors.dry,
    1: null,
    2: null,
    3: Colors.none,
    4: Colors.none,
    5: Colors.none,
  },
  13: {
    0: Colors.dry,
    1: null,
    2: null,
    3: ({ optimum, impossible, lastValue }) =>
      hslMix(Colors.optimum, Colors.impossible, (lastValue - optimum) / (impossible - optimum)),
    4: ({ optimum, impossible, lastValue }) =>
      hslMix(Colors.optimum, Colors.impossible, (lastValue - optimum) / (impossible - optimum)),
    5: Colors.impossible,
  },
  14: {
    0: Colors.dry,
    1: null,
    2: null,
    3: null,
    4: Colors.maximum,
    5: Colors.maximum,
  },
  15: {
    0: Colors.dry,
    1: null,
    2: null,
    3: null,
    4: null,
    5: Colors.impossible,
  },
};

export default function getSectionColor(data) {
  if (!data.lastValue) {
    return Colors.none.string();
  }
  const dry = getDryLevel(data);
  const row = getRow(data);
  const dataAndDry = { ...data, dry };
  const col = getCol(dataAndDry);
  const result = colorTable[row][col];
  if (result === null) {
    return mix(col, dataAndDry).string();
  } else if (isFunction(result)) {
    return result(data).string();
  }
  return result.string();
}
