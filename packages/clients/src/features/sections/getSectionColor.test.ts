import { GaugeBinding } from '@whitewater-guide/schema';
import color from 'color';

import {
  Colors,
  ColorStrings,
  getDryLevel,
  getSectionColor,
  hslMix,
} from './getSectionColor';
import { ColorizeableSectionFragment } from './sectionOnMap.generated';

const Mixes = {
  MaxImp: hslMix(Colors.maximum, Colors.impossible).hex(),
  OptImp: hslMix(Colors.optimum, Colors.impossible).hex(),
  OptMax: hslMix(Colors.optimum, Colors.maximum).hex(),
  MinOpt: hslMix(Colors.minimum, Colors.optimum).hex(),
  DryMin: hslMix(Colors.dry, Colors.minimum).hex(),
};

const makeSection = (
  binding: Omit<GaugeBinding, 'approximate'>,
  value?: number,
): ColorizeableSectionFragment => ({
  flows: {
    ...binding,
    approximate: false,
  },
  levels: null,
  gauge: {
    latestMeasurement:
      value === undefined ? undefined : { flow: value, level: 0 },
  },
});

describe('Sanity test', () => {
  const color1 = color.hsl(50, 50, 50);
  const color2 = color.hsl(100, 50, 50);

  it('HSL creation works', () => {
    expect(color1.string()).toBe('hsl(50, 50%, 50%)');
    expect(color2.string()).toBe('hsl(100, 50%, 50%)');
  });

  it('HSL to rgb works', () => {
    expect(color1.rgb().string()).toBe('rgb(191, 170, 64)');
    expect(color2.rgb().string()).toBe('rgb(106, 191, 64)');
  });

  it('HSL mix works', () => {
    const mixed = hslMix(color1, color2, 0.5);
    expect(mixed.rgb().string()).toBe('rgb(159, 191, 64)');
    expect(mixed.hsl().string()).toBe('hsl(75, 50%, 50%)');
  });
});

describe('Not enough input data', () => {
  it('should return default without gauge', () => {
    const input: ColorizeableSectionFragment = {
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
    const input: ColorizeableSectionFragment = {
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
      gauge: { latestMeasurement: null },
    };
    expect(getSectionColor(input)).toBe(ColorStrings.none);
  });

  it('should return default for gauge without last value', () => {
    const input: ColorizeableSectionFragment = {
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
      gauge: { latestMeasurement: { level: null, flow: null } },
    };
    expect(getSectionColor(input)).toBe(ColorStrings.none);
  });

  it('should return default when bindings are not provided', () => {
    const input: ColorizeableSectionFragment = {
      flows: null,
      levels: null,
      gauge: {
        latestMeasurement: { level: 10, flow: 10 },
      },
    };
    expect(getSectionColor(input)).toBe(ColorStrings.none);
  });

  it('should return default when available value doesnt match available binding', () => {
    const input: ColorizeableSectionFragment = {
      flows: null,
      levels: {
        minimum: 1,
        optimum: 2,
        maximum: 3,
        impossible: 4,
        approximate: false,
      },
      gauge: { latestMeasurement: { level: null, flow: 10 } },
    };
    expect(getSectionColor(input)).toBe(ColorStrings.none);
  });
});

it('should return prefer flow to level', () => {
  const input: ColorizeableSectionFragment = {
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
    gauge: { latestMeasurement: { level: 35, flow: 200 } },
  };
  expect(getSectionColor(input)).toBe(ColorStrings.optimum);
});

describe('00 - When not enough input data, it should', () => {
  const binding = {
    minimum: null,
    optimum: null,
    maximum: null,
    impossible: null,
    approximate: false,
  };

  it('paint section grey', () => {
    expect(getSectionColor(makeSection(binding, 13))).toBe(ColorStrings.none);
  });

  it('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });
});

describe('01 - When only IMP is provided, it should', () => {
  const binding = {
    minimum: null,
    optimum: null,
    maximum: null,
    impossible: 20,
    approximate: false,
  };

  it('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });

  it('handle VAL < IMP', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.none);
  });

  it('handle VAL == IMP', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.impossible,
    );
  });

  it('handle VAL > IMP', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(
      ColorStrings.impossible,
    );
  });
});

describe('02 - When only MAX is provided, it should', () => {
  const binding = {
    minimum: null,
    optimum: null,
    maximum: 20,
    impossible: null,
    approximate: false,
  };

  it('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });

  it('handle VAL < MAX', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.none);
  });

  it('handle VAL == MAX', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.maximum,
    );
  });

  it('handle VAL > MAX', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(
      ColorStrings.maximum,
    );
  });
});

describe('03 - When only MAX and ABS_MAX is provided, it should', () => {
  const binding = {
    minimum: null,
    optimum: null,
    maximum: 20,
    impossible: 40,
    approximate: false,
  };

  it('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });

  it('handle VAL < MAX', () => {
    expect(getSectionColor(makeSection(binding, 19))).toBe(ColorStrings.none);
  });

  it('handle MAX == VAL', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.maximum,
    );
  });

  it('handle MAX < VAL < IMPOSSIBLE', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(Mixes.MaxImp);
  });

  it('handle VAL == IMPOSSIBLE', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.impossible,
    );
  });

  it('handle VAL > IMPOSSIBLE', () => {
    expect(getSectionColor(makeSection(binding, 60))).toBe(
      ColorStrings.impossible,
    );
  });
});

describe('04 - When only OPT is provided, it should', () => {
  const binding = {
    minimum: null,
    optimum: 20,
    maximum: null,
    impossible: null,
    approximate: false,
  };

  it('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });

  it('handle VAL < OPT', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.none);
  });

  it('handle VAL == OPT', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(ColorStrings.none);
  });

  it('handle VAL > OPT', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(ColorStrings.none);
  });
});

describe('05 - When OPT and IMP is provided, it should', () => {
  const binding = {
    minimum: null,
    optimum: 20,
    maximum: null,
    impossible: 40,
    approximate: false,
  };

  it('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });

  it('handle V < OPT', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.none);
  });

  it('handle V == OPT', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.optimum,
    );
  });

  it('handle OPT < V < IMP', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(Mixes.OptImp);
  });

  it('handle V == IMP', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.impossible,
    );
  });

  it('handle V > IMP', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(
      ColorStrings.impossible,
    );
  });
});

describe('06 - When OPT and MAX is provided, it should', () => {
  const binding = {
    minimum: null,
    optimum: 20,
    maximum: 40,
    impossible: null,
    approximate: false,
  };

  it('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });

  it('handle VAL < OPT', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.none);
  });

  it('handle VAL == OPT', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.optimum,
    );
  });

  it('handle OPT < VAL < MAX', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(Mixes.OptMax);
  });

  it('handle VAL == MAX', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.maximum,
    );
  });

  it('handle VAL > MAX', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(
      ColorStrings.maximum,
    );
  });
});

describe('07 - When OPT, MAX and IMP are provided, it should', () => {
  const binding = {
    minimum: null,
    optimum: 20,
    maximum: 40,
    impossible: 60,
    approximate: false,
  };

  it('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(0);
  });

  it('handle VAL < OPT', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.none);
  });

  it('handle VAL == OPT', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.optimum,
    );
  });

  it('handle OPT < VAL < MAX', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(Mixes.OptMax);
  });

  it('handle VAL == MAX', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.maximum,
    );
  });

  it('handle MAX < VAL < IMP', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(Mixes.MaxImp);
  });

  it('handle VAL == IMP', () => {
    expect(getSectionColor(makeSection(binding, 60))).toBe(
      ColorStrings.impossible,
    );
  });

  it('handle VAL > IMP', () => {
    expect(getSectionColor(makeSection(binding, 70))).toBe(
      ColorStrings.impossible,
    );
  });
});

describe('08 - When only MIN is provided, it should', () => {
  const binding = {
    minimum: 20,
    optimum: null,
    maximum: null,
    impossible: null,
    approximate: false,
  };

  it('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(14);
  });

  it('handle VAL < DRY', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.dry);
  });

  it('handle VAL == DRY', () => {
    expect(getSectionColor(makeSection(binding, 14))).toBe(ColorStrings.dry);
  });

  it('handle DRY < VAL < MIN', () => {
    expect(getSectionColor(makeSection(binding, 17))).toBe(
      ColorStrings.minimum,
    );
  });

  it('handle VAL == MIN', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(ColorStrings.none);
  });

  it('handle VAL > MIN', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(ColorStrings.none);
  });
});

describe('09 - When MIN and IMP are provided, it should', () => {
  const binding = {
    minimum: 20,
    optimum: null,
    maximum: null,
    impossible: 40,
    approximate: false,
  };

  it('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(19);
  });

  it('handle VAL < DRY', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.dry);
  });

  it('handle VAL == DRY', () => {
    expect(getSectionColor(makeSection(binding, 19))).toBe(ColorStrings.dry);
  });

  it('handle DRY < VAL < MIN', () => {
    expect(getSectionColor(makeSection(binding, 19.5))).toBe(Mixes.DryMin);
  });

  it('handle VAL == MIN', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(ColorStrings.none);
  });

  it('handle MIN < VAL < IMP', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(ColorStrings.none);
  });

  it('handle VAL == IMP', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.impossible,
    );
  });

  it('handle VAL > IMP', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(
      ColorStrings.impossible,
    );
  });
});

describe('10 - When MIN and MAX are provided, it should', () => {
  const binding = {
    minimum: 20,
    optimum: null,
    maximum: 40,
    impossible: null,
    approximate: false,
  };

  it('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(18);
  });

  it('handle VAL < DRY', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.dry);
  });

  it('handle VAL == DRY', () => {
    expect(getSectionColor(makeSection(binding, 18))).toBe(ColorStrings.dry);
  });

  it('handle DRY < VAL < MIN', () => {
    expect(getSectionColor(makeSection(binding, 19))).toBe(Mixes.DryMin);
  });

  it('handle VAL == MIN', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(ColorStrings.none);
  });

  it('handle MIN < VAL < MAX', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(ColorStrings.none);
  });

  it('handle VAL == MAX', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.maximum,
    );
  });

  it('handle VAL > MIN', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(
      ColorStrings.maximum,
    );
  });
});

describe('11 - When MIN, MAX and IMP are provided, it should', () => {
  const binding = {
    minimum: 20,
    optimum: null,
    maximum: 40,
    impossible: 60,
    approximate: false,
  };

  it('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(18);
  });

  it('handle VAL < DRY', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.dry);
  });

  it('handle VAL == DRY', () => {
    expect(getSectionColor(makeSection(binding, 18))).toBe(ColorStrings.dry);
  });

  it('handle DRY < VAL < MIN', () => {
    expect(getSectionColor(makeSection(binding, 19))).toBe(Mixes.DryMin);
  });

  it('handle VAL == MIN', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(ColorStrings.none);
  });

  it('handle MIN < VAL < MAX', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(ColorStrings.none);
  });

  it('handle VAL == MAX', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.maximum,
    );
  });

  it('handle MAX < MAX < IMP', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(Mixes.MaxImp);
  });

  it('handle VAL == IMP', () => {
    expect(getSectionColor(makeSection(binding, 70))).toBe(
      ColorStrings.impossible,
    );
  });

  it('handle VAL > IMP', () => {
    expect(getSectionColor(makeSection(binding, 70))).toBe(
      ColorStrings.impossible,
    );
  });
});

describe('12 - When MIN and OPT are provided, it should', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: null,
    impossible: null,
    approximate: false,
  };

  it('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(16);
  });

  it('handle VAL < DRY', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.dry);
  });

  it('handle VAL == DRY', () => {
    expect(getSectionColor(makeSection(binding, 16))).toBe(ColorStrings.dry);
  });

  it('handle DRY < VAL < MIN', () => {
    expect(getSectionColor(makeSection(binding, 18))).toBe(Mixes.DryMin);
  });

  it('handle VAL == MIN', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.minimum,
    );
  });

  it('handle MIN < VAL < OPT', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(Mixes.MinOpt);
  });

  it('handle VAL == OPT', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(ColorStrings.none);
  });

  it('handle VAL > OPT', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(ColorStrings.none);
  });
});

describe('13 - When MIN, OPT and IMP are provided, it should', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: null,
    impossible: 60,
    approximate: false,
  };

  it('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(16);
  });

  it('handle VAL < DRY', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.dry);
  });

  it('handle VAL == DRY', () => {
    expect(getSectionColor(makeSection(binding, 16))).toBe(ColorStrings.dry);
  });

  it('handle DRY < VAL < MIN', () => {
    expect(getSectionColor(makeSection(binding, 18))).toBe(Mixes.DryMin);
  });

  it('handle VAL == MIN', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.minimum,
    );
  });

  it('handle MIN < VAL < OPT', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(Mixes.MinOpt);
  });

  it('handle VAL == OPT', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.optimum,
    );
  });

  it('handle OPT < VAL < IMP', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(Mixes.OptImp);
  });

  it('handle VAL == IMP', () => {
    expect(getSectionColor(makeSection(binding, 60))).toBe(
      ColorStrings.impossible,
    );
  });

  it('handle VAL > IMP', () => {
    expect(getSectionColor(makeSection(binding, 70))).toBe(
      ColorStrings.impossible,
    );
  });
});

describe('14 - When MIN, OPT and MAX are provided, it should', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: 60,
    impossible: null,
    approximate: false,
  };

  it('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(16);
  });

  it('handle VAL < DRY', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.dry);
  });

  it('handle VAL == DRY', () => {
    expect(getSectionColor(makeSection(binding, 16))).toBe(ColorStrings.dry);
  });

  it('handle DRY < VAL < MIN', () => {
    expect(getSectionColor(makeSection(binding, 18))).toBe(Mixes.DryMin);
  });

  it('handle VAL == MIN', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.minimum,
    );
  });

  it('handle MIN < VAL < OPT', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(Mixes.MinOpt);
  });

  it('handle VAL == OPT', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.optimum,
    );
  });

  it('handle OPT < VAL < MAX', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(Mixes.OptMax);
  });

  it('handle VAL == MAX', () => {
    expect(getSectionColor(makeSection(binding, 60))).toBe(
      ColorStrings.maximum,
    );
  });

  it('handle VAL > MAX', () => {
    expect(getSectionColor(makeSection(binding, 70))).toBe(
      ColorStrings.maximum,
    );
  });
});

describe('15 - When MIN, OPT, MAX and IMP are provided, it should', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: 60,
    impossible: 80,
    approximate: false,
  };

  it('correctly compute dry level', () => {
    expect(getDryLevel(binding)).toBe(16);
  });

  it('handle VAL < DRY', () => {
    expect(getSectionColor(makeSection(binding, 10))).toBe(ColorStrings.dry);
  });

  it('handle VAL == DRY', () => {
    expect(getSectionColor(makeSection(binding, 16))).toBe(ColorStrings.dry);
  });

  it('handle DRY < VAL < MIN', () => {
    expect(getSectionColor(makeSection(binding, 18))).toBe(Mixes.DryMin);
  });

  it('handle VAL == MIN', () => {
    expect(getSectionColor(makeSection(binding, 20))).toBe(
      ColorStrings.minimum,
    );
  });

  it('handle MIN < VAL < OPT', () => {
    expect(getSectionColor(makeSection(binding, 30))).toBe(Mixes.MinOpt);
  });

  it('handle VAL == OPT', () => {
    expect(getSectionColor(makeSection(binding, 40))).toBe(
      ColorStrings.optimum,
    );
  });

  it('handle OPT < VAL < MAX', () => {
    expect(getSectionColor(makeSection(binding, 50))).toBe(Mixes.OptMax);
  });

  it('handle VAL == MAX', () => {
    expect(getSectionColor(makeSection(binding, 60))).toBe(
      ColorStrings.maximum,
    );
  });

  it('handle MAX < VAL < IMP', () => {
    expect(getSectionColor(makeSection(binding, 70))).toBe(Mixes.MaxImp);
  });

  it('handle VAL == IMP', () => {
    expect(getSectionColor(makeSection(binding, 80))).toBe(
      ColorStrings.impossible,
    );
  });

  it('handle VAL > IMP', () => {
    expect(getSectionColor(makeSection(binding, 90))).toBe(
      ColorStrings.impossible,
    );
  });
});

it('Should handle sections without value', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: 60,
    impossible: 80,
    approximate: false,
  };
  expect(getSectionColor(makeSection(binding))).toBe(ColorStrings.none);
});

it('Should handle sections with formulas', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: 60,
    impossible: 80,
    approximate: false,
    formula: '(x + 20) * 3',
  };
  expect(getSectionColor(makeSection(binding, 20))).toBe(
    ColorStrings.impossible,
  );
});

it('should colorize provided value', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: 60,
    impossible: 80,
    approximate: false,
    formula: '(x + 20) * 3',
  };
  expect(getSectionColor(makeSection(binding, 2000), { flow: 0 })).toBe(
    ColorStrings.maximum,
  );
});
