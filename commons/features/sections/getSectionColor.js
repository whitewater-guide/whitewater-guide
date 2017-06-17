/* eslint no-bitwise: 0 */
import color from 'color';
import { isFunction, mapValues } from 'lodash';

// Color scheme described here:
// https://docs.google.com/spreadsheets/d/1DTg8aQM_MpZ6eaVg7vAg97K9Yv18Un8F291AonBSuEY/edit?usp=sharing

export const Colors = {
  none: color.rgb(100, 100, 100),
  minimum: color.rgb(0, 0, 255),
  optimum: color.rgb(0, 255, 0),
  maximum: color.rgb(255, 0, 0),
  impossible: color.rgb(153, 0, 0),
};

export const ColorStrings = mapValues(Colors, clr => clr.string());

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

function getCol({ minimum, maximum, optimum, impossible, lastValue }) {
  if (minimum && lastValue < minimum) {
    return 0;
  } else if (optimum && lastValue < optimum) {
    return 1;
  } else if (maximum && lastValue < maximum) {
    return 2;
  } else if (impossible && lastValue < impossible) {
    return 3;
  }
  return 4;
}

function mix(col, { minimum, maximum, optimum, impossible, lastValue }) {
  switch (col) {
    case 0:
      return Colors.minimum;
    case 1:
      return Colors.minimum.mix(Colors.optimum, (optimum - lastValue) / (optimum - minimum));
    case 2:
      return Colors.optimum.mix(Colors.maximum, (maximum - lastValue) / (maximum - optimum));
    case 3:
      return Colors.maximum.mix(Colors.impossible, (impossible - lastValue) / (impossible - maximum));
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
  },
  1: {
    0: Colors.none,
    1: Colors.none,
    2: Colors.none,
    3: Colors.none,
    4: Colors.impossible,
  },
  2: {
    0: Colors.none,
    1: Colors.none,
    2: Colors.none,
    3: Colors.maximum,
    4: Colors.maximum,
  },
  3: {
    0: Colors.none,
    1: Colors.none,
    2: Colors.none,
    3: null,
    4: Colors.impossible,
  },
  4: {
    0: Colors.none,
    1: Colors.none,
    2: Colors.none,
    3: Colors.none,
    4: Colors.none,
  },
  5: {
    0: Colors.none,
    1: Colors.none,
    2: ({ optimum, impossible, lastValue }) =>
      Colors.optimum.mix(Colors.impossible, (impossible - lastValue) / (impossible - optimum)),
    3: ({ optimum, impossible, lastValue }) =>
      Colors.optimum.mix(Colors.impossible, (impossible - lastValue) / (impossible - optimum)),
    4: Colors.impossible,
  },
  6: {
    0: Colors.none,
    1: Colors.none,
    2: null,
    3: Colors.maximum,
    4: Colors.maximum,
  },
  7: {
    0: Colors.none,
    1: Colors.none,
    2: null,
    3: null,
    4: Colors.impossible,
  },
  8: {
    0: Colors.minimum,
    1: Colors.none,
    2: Colors.none,
    3: Colors.none,
    4: Colors.none,
  },
  9: {
    0: Colors.minimum,
    1: Colors.none,
    2: Colors.none,
    3: Colors.none,
    4: Colors.impossible,
  },
  10: {
    0: Colors.minimum,
    1: Colors.none,
    2: Colors.none,
    3: Colors.maximum,
    4: Colors.maximum,
  },
  11: {
    0: Colors.minimum,
    1: Colors.none,
    2: Colors.none,
    3: null,
    4: Colors.impossible,
  },
  12: {
    0: Colors.minimum,
    1: null,
    2: Colors.none,
    3: Colors.none,
    4: Colors.none,
  },
  13: {
    0: Colors.minimum,
    1: null,
    2: ({ optimum, impossible, lastValue }) =>
      Colors.optimum.mix(Colors.impossible, (impossible - lastValue) / (impossible - optimum)),
    3: ({ optimum, impossible, lastValue }) =>
      Colors.optimum.mix(Colors.impossible, (impossible - lastValue) / (impossible - optimum)),
    4: Colors.impossible,
  },
  14: {
    0: Colors.minimum,
    1: null,
    2: null,
    3: Colors.maximum,
    4: Colors.maximum,
  },
  15: {
    0: Colors.minimum,
    1: null,
    2: null,
    3: null,
    4: Colors.impossible,
  },
};

export default function getSectionColor(data) {
  if (!data.lastValue) {
    return Colors.none.string();
  }
  const row = getRow(data);
  const col = getCol(data);
  const result = colorTable[row][col];
  if (result === null) {
    return mix(col, data).string();
  } else if (isFunction(result)) {
    return result(data).string();
  }
  return result.string();
}
