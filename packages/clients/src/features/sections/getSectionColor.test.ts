import { GaugeBinding } from '@whitewater-guide/commons';
import color from 'color';
import mapValues from 'lodash/mapValues';
import {
  ColorizeSection,
  Colors,
  getDryLevel,
  getSectionColor,
  hslMix,
} from './getSectionColor';

const ColorStrings = mapValues(Colors, (c) => c.hsl().string());

const Mixes = {
  MaxImp: hslMix(Colors.maximum, Colors.impossible)
    .hsl()
    .string(),
  OptImp: hslMix(Colors.optimum, Colors.impossible)
    .hsl()
    .string(),
  OptMax: hslMix(Colors.optimum, Colors.maximum)
    .hsl()
    .string(),
  MinOpt: hslMix(Colors.minimum, Colors.optimum)
    .hsl()
    .string(),
  DryMin: hslMix(Colors.dry, Colors.minimum)
    .hsl()
    .string(),
};

// tslint:disable-next-line:no-inferrable-types
const makeSection = (
  binding: Omit<GaugeBinding, 'approximate'>,
  value: number = 0,
): ColorizeSection => ({
  flows: {
    ...binding,
    approximate: false,
  },
  levels: null,
  gauge: {
    lastMeasurement: { timestamp: new Date(), flow: value, level: 0 },
  },
});

describe('Sanity test', () => {
  const color1 = color.hsl(50, 50, 50);
  const color2 = color.hsl(100, 50, 50);
  test('HSL creation works', () => {
    expect(color1.string()).toBe('hsl(50, 50%, 50%)');
    expect(color2.string()).toBe('hsl(100, 50%, 50%)');
  });
  test('HSL to rgb works', () => {
    expect(color1.rgb().string()).toBe('rgb(191, 170, 64)');
    expect(color2.rgb().string()).toBe('rgb(106, 191, 64)');
  });
  test('HSL mix works', () => {
    const mixed = hslMix(color1, color2, 0.5);
    expect(mixed.rgb().string()).toBe('rgb(159, 191, 64)');
    expect(mixed.hsl().string()).toBe('hsl(75, 50%, 50%)');
  });
});

describe('Not enough input data', () => {
  it('should return default without gauge', () => {
    const input: ColorizeSection = {
      flows: {
        minimum: 1,
        optimum: 2,
        maximum: 3,
        impossible: 4,
        approximate: false,
      },
      levels: {
        minimum: 1,
        optimum: 2,
        maximum: 3,
        impossible: 4,
        approximate: false,
      },
      gauge: null,
    };
    expect(getSectionColor(input)).toBe(ColorStrings.none);
  });

  it('should return default for gauge without last measurement', () => {
    const input: ColorizeSection = {
      flows: {
        minimum: 1,
        optimum: 2,
        maximum: 3,
        impossible: 4,
        approximate: false,
      },
      levels: {
        minimum: 1,
        optimum: 2,
        maximum: 3,
        impossible: 4,
        approximate: false,
      },
      gauge: { lastMeasurement: null },
    };
    expect(getSectionColor(input)).toBe(ColorStrings.none);
  });

  it('should return default for gauge without last value', () => {
    const input: ColorizeSection = {
      flows: {
        minimum: 1,
        optimum: 2,
        maximum: 3,
        impossible: 4,
        approximate: false,
      },
      levels: {
        minimum: 1,
        optimum: 2,
        maximum: 3,
        impossible: 4,
        approximate: false,
      },
      gauge: { lastMeasurement: { timestamp: new Date(), level: 0, flow: 0 } },
    };
    expect(getSectionColor(input)).toBe(ColorStrings.none);
  });

  it('should return default when bindings are not provided', () => {
    const input: ColorizeSection = {
      flows: null,
      levels: null,
      gauge: {
        lastMeasurement: { timestamp: new Date(), level: 10, flow: 10 },
      },
    };
    expect(getSectionColor(input)).toBe(ColorStrings.none);
  });

  it('should return default when available value doesnt match available binding', () => {
    const input: ColorizeSection = {
      flows: null,
      levels: {
        minimum: 1,
        optimum: 2,
        maximum: 3,
        impossible: 4,
        approximate: false,
      },
      gauge: { lastMeasurement: { timestamp: new Date(), level: 0, flow: 10 } },
    };
    expect(getSectionColor(input)).toBe(ColorStrings.none);
  });
});

it('should return prefer flow to level', () => {
  const input: ColorizeSection = {
    flows: {
      minimum: 100,
      optimum: 200,
      maximum: 300,
      impossible: 400,
      approximate: false,
    },
    levels: {
      minimum: 10,
      optimum: 20,
      maximum: 30,
      impossible: 40,
      approximate: false,
    },
    gauge: { lastMeasurement: { timestamp: new Date(), level: 35, flow: 200 } },
  };
  expect(getSectionColor(input)).toBe(ColorStrings.optimum);
});

describe('00 - When not enough input data, it should ', () => {
  const binding = {
    minimum: null,
    optimum: null,
    maximum: null,
    impossible: null,
    approximate: false,
  };
  test('paint section grey', () => {
    expect(getSectionColor(makeSection(binding, 13))).toBe(ColorStrings.none);
  });
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });
});

describe('01 - When only IMP is provided, it should ', () => {
  const binding = {
    minimum: null,
    optimum: null,
    maximum: null,
    impossible: 20,
    approximate: false,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });
  test('handle VAL < IMP', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.none);
  });
  test('handle VAL == IMP', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.impossible,
    );
  });
  test('handle VAL > IMP', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(
      ColorStrings.impossible,
    );
  });
});

describe('02 - When only MAX is provided, it should ', () => {
  const binding = {
    minimum: null,
    optimum: null,
    maximum: 20,
    impossible: null,
    approximate: false,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });
  test('handle VAL < MAX', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.none);
  });
  test('handle VAL == MAX', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.maximum,
    );
  });
  test('handle VAL < MAX', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(
      ColorStrings.maximum,
    );
  });
});

describe('03 - When only MAX and ABS_MAX is provided, it should ', () => {
  const binding = {
    minimum: null,
    optimum: null,
    maximum: 20,
    impossible: 40,
    approximate: false,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });
  test('handle VAL < MAX', () => {
    expect(getSectionColor(makeSection(binding, 19))).toBe(ColorStrings.none);
  });
  test('handle MAX == VAL', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.maximum,
    );
  });
  test('handle MAX < VAL < IMPOSSIBLE', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(Mixes.MaxImp);
  });
  test('handle VAL == IMPOSSIBLE', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.impossible,
    );
  });
  test('handle VAL > IMPOSSIBLE', () => {
    expect(getSectionColor(makeSection(binding, 60))).toBe(
      ColorStrings.impossible,
    );
  });
});

describe('04 - When only OPT is provided, it should ', () => {
  const binding = {
    minimum: null,
    optimum: 20,
    maximum: null,
    impossible: null,
    approximate: false,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });
  test('handle VAL < OPT', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.none);
  });
  test('handle VAL == OPT', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(ColorStrings.none);
  });
  test('handle VAL > OPT', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(ColorStrings.none);
  });
});

describe('05 - When OPT and IMP is provided, it should ', () => {
  const binding = {
    minimum: null,
    optimum: 20,
    maximum: null,
    impossible: 40,
    approximate: false,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });
  test('handle V < OPT', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.none);
  });
  test('handle V == OPT', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.optimum,
    );
  });
  test('handle OPT < V < IMP', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(Mixes.OptImp);
  });
  test('handle V == IMP', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.impossible,
    );
  });
  test('handle V > IMP', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(
      ColorStrings.impossible,
    );
  });
});

describe('06 - When OPT and MAX is provided, it should ', () => {
  const binding = {
    minimum: null,
    optimum: 20,
    maximum: 40,
    impossible: null,
    approximate: false,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });
  test('handle VAL < OPT', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.none);
  });
  test('handle VAL == OPT', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.optimum,
    );
  });
  test('handle OPT < VAL < MAX', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(Mixes.OptMax);
  });
  test('handle VAL == MAX', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.maximum,
    );
  });
  test('handle VAL > MAX', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(
      ColorStrings.maximum,
    );
  });
});

describe('07 - When OPT, MAX and IMP are provided, it should ', () => {
  const binding = {
    minimum: null,
    optimum: 20,
    maximum: 40,
    impossible: 60,
    approximate: false,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });
  test('handle VAL < OPT', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.none);
  });
  test('handle VAL == OPT', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.optimum,
    );
  });
  test('handle OPT < VAL < MAX', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(Mixes.OptMax);
  });
  test('handle VAL == MAX', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.maximum,
    );
  });
  test('handle MAX < VAL < IMP', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(Mixes.MaxImp);
  });
  test('handle VAL == IMP', () => {
    expect(getSectionColor(makeSection(binding, 60))).toBe(
      ColorStrings.impossible,
    );
  });
  test('handle VAL > IMP', () => {
    expect(getSectionColor(makeSection(binding, 70))).toBe(
      ColorStrings.impossible,
    );
  });
});

describe('08 - When only MIN is provided, it should ', () => {
  const binding = {
    minimum: 20,
    optimum: null,
    maximum: null,
    impossible: null,
    approximate: false,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(14);
  });
  test('handle VAL < DRY', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.dry);
  });
  test('handle VAL == DRY', () => {
    expect(getSectionColor(makeSection(binding, 14))).toBe(ColorStrings.dry);
  });
  test('handle DRY < VAL < MIN', () => {
    expect(getSectionColor(makeSection(binding, 17))).toBe(
      ColorStrings.minimum,
    );
  });
  test('handle VAL == MIN', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(ColorStrings.none);
  });
  test('handle VAL > MIN', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(ColorStrings.none);
  });
});

describe('09 - When MIN and IMP are provided, it should ', () => {
  const binding = {
    minimum: 20,
    optimum: null,
    maximum: null,
    impossible: 40,
    approximate: false,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(19);
  });
  test('handle VAL < DRY', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.dry);
  });
  test('handle VAL == DRY', () => {
    expect(getSectionColor(makeSection(binding, 19))).toBe(ColorStrings.dry);
  });
  test('handle DRY < VAL < MIN', () => {
    expect(getSectionColor(makeSection(binding, 19.5))).toBe(Mixes.DryMin);
  });
  test('handle VAL == MIN', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(ColorStrings.none);
  });
  test('handle MIN < VAL < IMP', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(ColorStrings.none);
  });
  test('handle VAL == IMP', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.impossible,
    );
  });
  test('handle VAL > IMP', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(
      ColorStrings.impossible,
    );
  });
});

describe('10 - When MIN and MAX are provided, it should ', () => {
  const binding = {
    minimum: 20,
    optimum: null,
    maximum: 40,
    impossible: null,
    approximate: false,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(18);
  });
  test('handle VAL < DRY', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.dry);
  });
  test('handle VAL == DRY', () => {
    expect(getSectionColor(makeSection(binding, 18))).toBe(ColorStrings.dry);
  });
  test('handle DRY < VAL < MIN', () => {
    expect(getSectionColor(makeSection(binding, 19))).toBe(Mixes.DryMin);
  });
  test('handle VAL == MIN', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(ColorStrings.none);
  });
  test('handle MIN < VAL < MAX', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(ColorStrings.none);
  });
  test('handle VAL == MAX', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.maximum,
    );
  });
  test('handle VAL > MIN', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(
      ColorStrings.maximum,
    );
  });
});

describe('11 - When MIN, MAX and IMP are provided, it should ', () => {
  const binding = {
    minimum: 20,
    optimum: null,
    maximum: 40,
    impossible: 60,
    approximate: false,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(18);
  });
  test('handle VAL < DRY', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.dry);
  });
  test('handle VAL == DRY', () => {
    expect(getSectionColor(makeSection(binding, 18))).toBe(ColorStrings.dry);
  });
  test('handle DRY < VAL < MIN', () => {
    expect(getSectionColor(makeSection(binding, 19))).toBe(Mixes.DryMin);
  });
  test('handle VAL == MIN', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(ColorStrings.none);
  });
  test('handle MIN < VAL < MAX', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(ColorStrings.none);
  });
  test('handle VAL == MAX', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.maximum,
    );
  });
  test('handle MAX < MAX < IMP', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(Mixes.MaxImp);
  });
  test('handle VAL == IMP', () => {
    expect(getSectionColor(makeSection(binding, 70))).toBe(
      ColorStrings.impossible,
    );
  });
  test('handle VAL > IMP', () => {
    expect(getSectionColor(makeSection(binding, 70))).toBe(
      ColorStrings.impossible,
    );
  });
});

describe('12 - When MIN and OPT are provided, it should ', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: null,
    impossible: null,
    approximate: false,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(16);
  });
  test('handle VAL < DRY', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.dry);
  });
  test('handle VAL == DRY', () => {
    expect(getSectionColor(makeSection(binding, 16))).toBe(ColorStrings.dry);
  });
  test('handle DRY < VAL < MIN', () => {
    expect(getSectionColor(makeSection(binding, 18))).toBe(Mixes.DryMin);
  });
  test('handle VAL == MIN', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.minimum,
    );
  });
  test('handle MIN < VAL < OPT', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(Mixes.MinOpt);
  });
  test('handle VAL == OPT', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(ColorStrings.none);
  });
  test('handle VAL > OPT', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(ColorStrings.none);
  });
});

describe('13 - When MIN, OPT and IMP are provided, it should ', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: null,
    impossible: 60,
    approximate: false,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(16);
  });
  test('handle VAL < DRY', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.dry);
  });
  test('handle VAL == DRY', () => {
    expect(getSectionColor(makeSection(binding, 16))).toBe(ColorStrings.dry);
  });
  test('handle DRY < VAL < MIN', () => {
    expect(getSectionColor(makeSection(binding, 18))).toBe(Mixes.DryMin);
  });
  test('handle VAL == MIN', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.minimum,
    );
  });
  test('handle MIN < VAL < OPT', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(Mixes.MinOpt);
  });
  test('handle VAL == OPT', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.optimum,
    );
  });
  test('handle OPT < VAL < IMP', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(Mixes.OptImp);
  });
  test('handle VAL == IMP', () => {
    expect(getSectionColor(makeSection(binding, 60))).toBe(
      ColorStrings.impossible,
    );
  });
  test('handle VAL > IMP', () => {
    expect(getSectionColor(makeSection(binding, 70))).toBe(
      ColorStrings.impossible,
    );
  });
});

describe('14 - When MIN, OPT and MAX are provided, it should ', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: 60,
    impossible: null,
    approximate: false,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(16);
  });
  test('handle VAL < DRY', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.dry);
  });
  test('handle VAL == DRY', () => {
    expect(getSectionColor(makeSection(binding, 16))).toBe(ColorStrings.dry);
  });
  test('handle DRY < VAL < MIN', () => {
    expect(getSectionColor(makeSection(binding, 18))).toBe(Mixes.DryMin);
  });
  test('handle VAL == MIN', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.minimum,
    );
  });
  test('handle MIN < VAL < OPT', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(Mixes.MinOpt);
  });
  test('handle VAL == OPT', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.optimum,
    );
  });
  test('handle OPT < VAL < MAX', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(Mixes.OptMax);
  });
  test('handle VAL == MAX', () => {
    expect(getSectionColor(makeSection(binding, 60))).toBe(
      ColorStrings.maximum,
    );
  });
  test('handle VAL > MAX', () => {
    expect(getSectionColor(makeSection(binding, 70))).toBe(
      ColorStrings.maximum,
    );
  });
});

describe('15 - When MIN, OPT, MAX and IMP are provided, it should ', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: 60,
    impossible: 80,
    approximate: false,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(16);
  });
  test('handle VAL < DRY', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.dry);
  });
  test('handle VAL == DRY', () => {
    expect(getSectionColor(makeSection(binding, 16))).toBe(ColorStrings.dry);
  });
  test('handle DRY < VAL < MIN', () => {
    expect(getSectionColor(makeSection(binding, 18))).toBe(Mixes.DryMin);
  });
  test('handle VAL == MIN', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.minimum,
    );
  });
  test('handle MIN < VAL < OPT', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(Mixes.MinOpt);
  });
  test('handle VAL == OPT', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.optimum,
    );
  });
  test('handle OPT < VAL < MAX', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(Mixes.OptMax);
  });
  test('handle VAL == MAX', () => {
    expect(getSectionColor(makeSection(binding, 60))).toBe(
      ColorStrings.maximum,
    );
  });
  test('handle MAX < VAL < IMP', () => {
    expect(getSectionColor(makeSection(binding, 70))).toBe(Mixes.MaxImp);
  });
  test('handle VAL == IMP', () => {
    expect(getSectionColor(makeSection(binding, 80))).toBe(
      ColorStrings.impossible,
    );
  });
  test('handle VAL > IMP', () => {
    expect(getSectionColor(makeSection(binding, 90))).toBe(
      ColorStrings.impossible,
    );
  });
});

test('Should handle sections without value', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: 60,
    impossible: 80,
    approximate: false,
  };
  expect(getSectionColor(makeSection(binding))).toBe(ColorStrings.none);
});
