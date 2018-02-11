import * as color from 'color';
import { mapValues } from 'lodash';
import { Colors, getDryLevel, getSectionColor, hslMix } from './getSectionColor';

const ColorStrings = mapValues(Colors, c => c.hsl().string());

const Mixes = {
  MaxImp: hslMix(Colors.maximum, Colors.impossible).hsl().string(),
  OptImp: hslMix(Colors.optimum, Colors.impossible).hsl().string(),
  OptMax: hslMix(Colors.optimum, Colors.maximum).hsl().string(),
  MinOpt: hslMix(Colors.minimum, Colors.optimum).hsl().string(),
  DryMin: hslMix(Colors.dry, Colors.minimum).hsl().string(),
};

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

describe('00 - When no gauge binding provided, it should ', () => {
  const binding = {
    minimum: undefined,
    optimum: undefined,
    maximum: undefined,
    impossible: undefined,
    lastValue: 13,
  };
  test('paint section grey', () => {
    expect(getSectionColor(binding)).toBe(ColorStrings.none);
  });
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });
});

describe('01 - When only IMP is provided, it should ', () => {
  const binding = {
    minimum: undefined,
    optimum: undefined,
    maximum: undefined,
    impossible: 20,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });
  test('handle VAL < IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(ColorStrings.none);
  });
  test('handle VAL == IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(ColorStrings.impossible);
  });
  test('handle VAL > IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(ColorStrings.impossible);
  });
});

describe('02 - When only MAX is provided, it should ', () => {
  const binding = {
    minimum: undefined,
    optimum: undefined,
    maximum: 20,
    impossible: undefined,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });
  test('handle VAL < MAX', () => {
    expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(ColorStrings.none);
  });
  test('handle VAL == MAX', () => {
    expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(ColorStrings.maximum);
  });
  test('handle VAL < MAX', () => {
    expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(ColorStrings.maximum);
  });
});

describe('03 - When only MAX and ABS_MAX is provided, it should ', () => {
  const binding = {
    minimum: undefined,
    optimum: undefined,
    maximum: 20,
    impossible: 40,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });
  test('handle VAL < MAX', () => {
    expect(getSectionColor({ ...binding, lastValue: 19 })).toBe(ColorStrings.none);
  });
  test('handle MAX == VAL', () => {
    expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(ColorStrings.maximum);
  });
  test('handle MAX < VAL < IMPOSSIBLE', () => {
    expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Mixes.MaxImp);
  });
  test('handle VAL == IMPOSSIBLE', () => {
    expect(getSectionColor({ ...binding, lastValue: 40 })).toBe(ColorStrings.impossible);
  });
  test('handle VAL > IMPOSSIBLE', () => {
    expect(getSectionColor({ ...binding, lastValue: 60 })).toBe(ColorStrings.impossible);
  });
});

describe('04 - When only OPT is provided, it should ', () => {
  const binding = {
    minimum: undefined,
    optimum: 20,
    maximum: undefined,
    impossible: undefined,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });
  test('handle VAL < OPT', () => {
    expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(ColorStrings.none);
  });
  test('handle VAL == OPT', () => {
    expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(ColorStrings.none);
  });
  test('handle VAL > OPT', () => {
    expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(ColorStrings.none);
  });
});

describe('05 - When OPT and IMP is provided, it should ', () => {
  const binding = {
    minimum: undefined,
    optimum: 20,
    maximum: undefined,
    impossible: 40,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });
  test('handle V < OPT', () => {
    expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(ColorStrings.none);
  });
  test('handle V == OPT', () => {
    expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(ColorStrings.optimum);
  });
  test('handle OPT < V < IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Mixes.OptImp);
  });
  test('handle V == IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 40 })).toBe(ColorStrings.impossible);
  });
  test('handle V > IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(ColorStrings.impossible);
  });
});

describe('06 - When OPT and MAX is provided, it should ', () => {
  const binding = {
    minimum: undefined,
    optimum: 20,
    maximum: 40,
    impossible: undefined,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });
  test('handle VAL < OPT', () => {
    expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(ColorStrings.none);
  });
  test('handle VAL == OPT', () => {
    expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(ColorStrings.optimum);
  });
  test('handle OPT < VAL < MAX', () => {
    expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Mixes.OptMax);
  });
  test('handle VAL == MAX', () => {
    expect(getSectionColor({ ...binding, lastValue: 40 })).toBe(ColorStrings.maximum);
  });
  test('handle VAL > MAX', () => {
    expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(ColorStrings.maximum);
  });
});

describe('07 - When OPT, MAX and IMP are provided, it should ', () => {
  const binding = {
    minimum: undefined,
    optimum: 20,
    maximum: 40,
    impossible: 60,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });
  test('handle VAL < OPT', () => {
    expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(ColorStrings.none);
  });
  test('handle VAL == OPT', () => {
    expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(ColorStrings.optimum);
  });
  test('handle OPT < VAL < MAX', () => {
    expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Mixes.OptMax);
  });
  test('handle VAL == MAX', () => {
    expect(getSectionColor({ ...binding, lastValue: 40 })).toBe(ColorStrings.maximum);
  });
  test('handle MAX < VAL < IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(Mixes.MaxImp);
  });
  test('handle VAL == IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 60 })).toBe(ColorStrings.impossible);
  });
  test('handle VAL > IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 70 })).toBe(ColorStrings.impossible);
  });
});

describe('08 - When only MIN is provided, it should ', () => {
  const binding = {
    minimum: 20,
    optimum: undefined,
    maximum: undefined,
    impossible: undefined,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(14);
  });
  test('handle VAL < DRY', () => {
    expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(ColorStrings.dry);
  });
  test('handle VAL == DRY', () => {
    expect(getSectionColor({ ...binding, lastValue: 14 })).toBe(ColorStrings.dry);
  });
  test('handle DRY < VAL < MIN', () => {
    expect(getSectionColor({ ...binding, lastValue: 17 })).toBe(ColorStrings.minimum);
  });
  test('handle VAL == MIN', () => {
    expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(ColorStrings.none);
  });
  test('handle VAL > MIN', () => {
    expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(ColorStrings.none);
  });
});

describe('09 - When MIN and IMP are provided, it should ', () => {
  const binding = {
    minimum: 20,
    optimum: undefined,
    maximum: undefined,
    impossible: 40,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(19);
  });
  test('handle VAL < DRY', () => {
    expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(ColorStrings.dry);
  });
  test('handle VAL == DRY', () => {
    expect(getSectionColor({ ...binding, lastValue: 19 })).toBe(ColorStrings.dry);
  });
  test('handle DRY < VAL < MIN', () => {
    expect(getSectionColor({ ...binding, lastValue: 19.5 })).toBe(Mixes.DryMin);
  });
  test('handle VAL == MIN', () => {
    expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(ColorStrings.none);
  });
  test('handle MIN < VAL < IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(ColorStrings.none);
  });
  test('handle VAL == IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 40 })).toBe(ColorStrings.impossible);
  });
  test('handle VAL > IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(ColorStrings.impossible);
  });
});

describe('10 - When MIN and MAX are provided, it should ', () => {
  const binding = {
    minimum: 20,
    optimum: undefined,
    maximum: 40,
    impossible: undefined,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(18);
  });
  test('handle VAL < DRY', () => {
    expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(ColorStrings.dry);
  });
  test('handle VAL == DRY', () => {
    expect(getSectionColor({ ...binding, lastValue: 18 })).toBe(ColorStrings.dry);
  });
  test('handle DRY < VAL < MIN', () => {
    expect(getSectionColor({ ...binding, lastValue: 19 })).toBe(Mixes.DryMin);
  });
  test('handle VAL == MIN', () => {
    expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(ColorStrings.none);
  });
  test('handle MIN < VAL < MAX', () => {
    expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(ColorStrings.none);
  });
  test('handle VAL == MAX', () => {
    expect(getSectionColor({ ...binding, lastValue: 40 })).toBe(ColorStrings.maximum);
  });
  test('handle VAL > MIN', () => {
    expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(ColorStrings.maximum);
  });
});

describe('11 - When MIN, MAX and IMP are provided, it should ', () => {
  const binding = {
    minimum: 20,
    optimum: undefined,
    maximum: 40,
    impossible: 60,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(18);
  });
  test('handle VAL < DRY', () => {
    expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(ColorStrings.dry);
  });
  test('handle VAL == DRY', () => {
    expect(getSectionColor({ ...binding, lastValue: 18 })).toBe(ColorStrings.dry);
  });
  test('handle DRY < VAL < MIN', () => {
    expect(getSectionColor({ ...binding, lastValue: 19 })).toBe(Mixes.DryMin);
  });
  test('handle VAL == MIN', () => {
    expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(ColorStrings.none);
  });
  test('handle MIN < VAL < MAX', () => {
    expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(ColorStrings.none);
  });
  test('handle VAL == MAX', () => {
    expect(getSectionColor({ ...binding, lastValue: 40 })).toBe(ColorStrings.maximum);
  });
  test('handle MAX < MAX < IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(Mixes.MaxImp);
  });
  test('handle VAL == IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 70 })).toBe(ColorStrings.impossible);
  });
  test('handle VAL > IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 70 })).toBe(ColorStrings.impossible);
  });
});

describe('12 - When MIN and OPT are provided, it should ', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: undefined,
    impossible: undefined,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(16);
  });
  test('handle VAL < DRY', () => {
    expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(ColorStrings.dry);
  });
  test('handle VAL == DRY', () => {
    expect(getSectionColor({ ...binding, lastValue: 16 })).toBe(ColorStrings.dry);
  });
  test('handle DRY < VAL < MIN', () => {
    expect(getSectionColor({ ...binding, lastValue: 18 })).toBe(Mixes.DryMin);
  });
  test('handle VAL == MIN', () => {
    expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(ColorStrings.minimum);
  });
  test('handle MIN < VAL < OPT', () => {
    expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Mixes.MinOpt);
  });
  test('handle VAL == OPT', () => {
    expect(getSectionColor({ ...binding, lastValue: 40 })).toBe(ColorStrings.none);
  });
  test('handle VAL > OPT', () => {
    expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(ColorStrings.none);
  });
});

describe('13 - When MIN, OPT and IMP are provided, it should ', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: undefined,
    impossible: 60,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(16);
  });
  test('handle VAL < DRY', () => {
    expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(ColorStrings.dry);
  });
  test('handle VAL == DRY', () => {
    expect(getSectionColor({ ...binding, lastValue: 16 })).toBe(ColorStrings.dry);
  });
  test('handle DRY < VAL < MIN', () => {
    expect(getSectionColor({ ...binding, lastValue: 18 })).toBe(Mixes.DryMin);
  });
  test('handle VAL == MIN', () => {
    expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(ColorStrings.minimum);
  });
  test('handle MIN < VAL < OPT', () => {
    expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Mixes.MinOpt);
  });
  test('handle VAL == OPT', () => {
    expect(getSectionColor({ ...binding, lastValue: 40 })).toBe(ColorStrings.optimum);
  });
  test('handle OPT < VAL < IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(Mixes.OptImp);
  });
  test('handle VAL == IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 60 })).toBe(ColorStrings.impossible);
  });
  test('handle VAL > IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 70 })).toBe(ColorStrings.impossible);
  });
});

describe('14 - When MIN, OPT and MAX are provided, it should ', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: 60,
    impossible: undefined,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(16);
  });
  test('handle VAL < DRY', () => {
    expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(ColorStrings.dry);
  });
  test('handle VAL == DRY', () => {
    expect(getSectionColor({ ...binding, lastValue: 16 })).toBe(ColorStrings.dry);
  });
  test('handle DRY < VAL < MIN', () => {
    expect(getSectionColor({ ...binding, lastValue: 18 })).toBe(Mixes.DryMin);
  });
  test('handle VAL == MIN', () => {
    expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(ColorStrings.minimum);
  });
  test('handle MIN < VAL < OPT', () => {
    expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Mixes.MinOpt);
  });
  test('handle VAL == OPT', () => {
    expect(getSectionColor({ ...binding, lastValue: 40 })).toBe(ColorStrings.optimum);
  });
  test('handle OPT < VAL < MAX', () => {
    expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(Mixes.OptMax);
  });
  test('handle VAL == MAX', () => {
    expect(getSectionColor({ ...binding, lastValue: 60 })).toBe(ColorStrings.maximum);
  });
  test('handle VAL > MAX', () => {
    expect(getSectionColor({ ...binding, lastValue: 70 })).toBe(ColorStrings.maximum);
  });
});

describe('15 - When MIN, OPT, MAX and IMP are provided, it should ', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: 60,
    impossible: 80,
  };
  test('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(16);
  });
  test('handle VAL < DRY', () => {
    expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(ColorStrings.dry);
  });
  test('handle VAL == DRY', () => {
    expect(getSectionColor({ ...binding, lastValue: 16 })).toBe(ColorStrings.dry);
  });
  test('handle DRY < VAL < MIN', () => {
    expect(getSectionColor({ ...binding, lastValue: 18 })).toBe(Mixes.DryMin);
  });
  test('handle VAL == MIN', () => {
    expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(ColorStrings.minimum);
  });
  test('handle MIN < VAL < OPT', () => {
    expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Mixes.MinOpt);
  });
  test('handle VAL == OPT', () => {
    expect(getSectionColor({ ...binding, lastValue: 40 })).toBe(ColorStrings.optimum);
  });
  test('handle OPT < VAL < MAX', () => {
    expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(Mixes.OptMax);
  });
  test('handle VAL == MAX', () => {
    expect(getSectionColor({ ...binding, lastValue: 60 })).toBe(ColorStrings.maximum);
  });
  test('handle MAX < VAL < IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 70 })).toBe(Mixes.MaxImp);
  });
  test('handle VAL == IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 80 })).toBe(ColorStrings.impossible);
  });
  test('handle VAL > IMP', () => {
    expect(getSectionColor({ ...binding, lastValue: 90 })).toBe(ColorStrings.impossible);
  });
});

test('Should handle sections without value', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: 60,
    impossible: 80,
  };
  expect(getSectionColor({ ...binding })).toBe(ColorStrings.none);
  // expect(getSectionColor({ ...binding, lastValue: null })).toBe(ColorStrings.none);
  expect(getSectionColor({ ...binding, lastValue: 0 })).toBe(ColorStrings.none);
});
