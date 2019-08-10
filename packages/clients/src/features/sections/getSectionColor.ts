/* tslint:disable:no-bitwise */
import { GaugeBinding, Measurement, Section } from '@whitewater-guide/commons';
import color from 'color';
import isFunction from 'lodash/isFunction';
import mapValues from 'lodash/mapValues';
import { getBindingFormula } from './formulas';

interface DryBinding extends GaugeBinding {
  dry: number;
}

// Color scheme is discussed here: https://github.com/doomsower/whitewater/issues/45
// Basically, we process every possible combination of present/absent minimum,optimum, maximum and impossible levels
// This makes 16 combinations, or rows
// If minimum is present, we also compute 'absolute' minimum
// Then after we determined row we check in which interval the value falls - this is column
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

export const ColorStrings = mapValues(Colors, (clr) => clr.hsl().string());

/**
 * Function for highlighting gauge binding values in UI, does no mixing, only exact threshold values are colorized
 * @param {number} value
 * @param {GaugeBinding} binding
 * @param {string} defaultColor Fallback color
 * @returns {string}
 */
export const getColorForValue = (
  value: number,
  binding: GaugeBinding | undefined | null,
  defaultColor: string,
) => {
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
export function getDryLevel({
  minimum,
  maximum,
  optimum,
  impossible,
}: GaugeBinding) {
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

function getRow({ minimum, maximum, optimum, impossible }: GaugeBinding) {
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

function getCol(
  { dry, minimum, maximum, optimum, impossible }: DryBinding,
  lastValue: number,
) {
  if (dry >= lastValue!) {
    return 0;
  } else if (minimum && lastValue! < minimum) {
    return 1;
  } else if (optimum && lastValue! < optimum) {
    return 2;
  } else if (maximum && lastValue! < maximum) {
    return 3;
  } else if (impossible && lastValue! < impossible) {
    return 4;
  }
  return 5;
}

/* tslint:disable-next-line:no-inferrable-types */
export function hslMix(color1: color, color2: color, ratio: number = 0.5) {
  const [h1, s1, l1] = color1.hsl().array();
  const [h2, s2, l2] = color2.hsl().array();
  const dh = h2 - h1;
  const ds = s2 - s1;
  const dl = l2 - l1;
  return color.hsl([
    Math.round(h1 + dh * ratio),
    Math.round(s1 + ds * ratio),
    Math.round(l1 + dl * ratio),
  ]);
}

function mix(
  col: number,
  { dry, minimum, maximum, optimum, impossible }: DryBinding,
  lastValue: number,
) {
  switch (col) {
    case 0:
      return Colors.dry;
    case 1:
      return hslMix(
        Colors.dry,
        Colors.minimum,
        (lastValue! - dry) / (minimum! - dry),
      );
    case 2:
      return hslMix(
        Colors.minimum,
        Colors.optimum,
        (lastValue! - minimum!) / (optimum! - minimum!),
      );
    case 3:
      return hslMix(
        Colors.optimum,
        Colors.maximum,
        (lastValue! - optimum!) / (maximum! - optimum!),
      );
    case 4:
      return hslMix(
        Colors.maximum,
        Colors.impossible,
        (lastValue! - maximum!) / (impossible! - maximum!),
      );
    default:
      return Colors.impossible;
  }
}

interface ColorTable {
  [row: number]: {
    [col: number]:
      | color
      | ((b: GaugeBinding, lastValue: number) => color)
      | null;
  };
}

const colorTable: ColorTable = {
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
    3: ({ optimum, impossible }: GaugeBinding, lastValue: number) =>
      hslMix(
        Colors.optimum,
        Colors.impossible,
        (lastValue! - optimum!) / (impossible! - optimum!),
      ),
    4: ({ optimum, impossible }: GaugeBinding, lastValue: number) =>
      hslMix(
        Colors.optimum,
        Colors.impossible,
        (lastValue! - optimum!) / (impossible! - optimum!),
      ),
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
    3: ({ optimum, impossible }: GaugeBinding, lastValue: number) =>
      hslMix(
        Colors.optimum,
        Colors.impossible,
        (lastValue! - optimum!) / (impossible! - optimum!),
      ),
    4: ({ optimum, impossible }: GaugeBinding, lastValue: number) =>
      hslMix(
        Colors.optimum,
        Colors.impossible,
        (lastValue! - optimum!) / (impossible! - optimum!),
      ),
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

// Subset of section data required to compute its color
interface PGauge {
  lastMeasurement: Pick<Measurement, 'level' | 'flow'> | null;
}
export type ColorizeSection = Pick<Section, 'flows' | 'levels'> & {
  gauge: PGauge | null;
};

export function getSectionColorRaw(section: ColorizeSection): color {
  if (!section.gauge || !section.gauge.lastMeasurement) {
    return Colors.none;
  }
  const { flow, level } = section.gauge.lastMeasurement;
  if (!flow && !level) {
    return Colors.none;
  }
  let lastValue = 0;
  let binding: GaugeBinding | undefined;
  if (flow && section.flows) {
    lastValue = getBindingFormula(section.flows)(flow);
    binding = section.flows;
  } else if (level && section.levels) {
    // it makes no sense to use formulas for levels...
    lastValue = level;
    binding = section.levels;
  }
  if (!binding || !lastValue) {
    return Colors.none;
  }

  const dry = getDryLevel(binding);
  const row = getRow(binding);
  const dataAndDry: DryBinding = { ...binding, dry };
  const col = getCol(dataAndDry, lastValue);
  const result = colorTable[row][col];
  if (result === null) {
    return mix(col, dataAndDry, lastValue);
  } else if (isFunction(result)) {
    return result(binding, lastValue);
  }
  return result as color;
}

export function getSectionColor(section: ColorizeSection): string {
  return getSectionColorRaw(section).string();
}
