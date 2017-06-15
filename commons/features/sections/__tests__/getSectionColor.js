import getSectionColor, { Colors } from '../getSectionColor';

const Mixes = {
  MaxImp: Colors.maximum.mix(Colors.impossible).string(),
  OptImp: Colors.optimum.mix(Colors.impossible).string(),
  OptMax: Colors.optimum.mix(Colors.maximum).string(),
  MinOpt: Colors.minimum.mix(Colors.optimum).string(),
};

test('Should return grey when no gauge binding provided', () => {
  expect(getSectionColor({
    minimum: undefined,
    optimum: undefined,
    maximum: undefined,
    impossible: undefined,
    lastValue: 13,
  })).toBe(Colors.none.string());
});

test('Should handle only impossible mark', () => {
  const binding = {
    minimum: undefined,
    optimum: undefined,
    maximum: undefined,
    impossible: 20,
  };
  expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(Colors.none.string());
  expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(Colors.impossible.string());
  expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Colors.impossible.string());
});

test('Should handle only maximum mark', () => {
  const binding = {
    minimum: undefined,
    optimum: undefined,
    maximum: 20,
    impossible: undefined,
  };
  expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(Colors.none.string());
  expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(Colors.maximum.string());
  expect(getSectionColor({ ...binding, lastValue: 21 })).toBe(Colors.maximum.string());
});

test('Should handle maximum + impossible marks', () => {
  const binding = {
    minimum: undefined,
    optimum: undefined,
    maximum: 20,
    impossible: 40,
  };
  expect(getSectionColor({ ...binding, lastValue: 19 })).toBe(Colors.none.string());
  expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(Colors.maximum.string());
  expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Mixes.MaxImp);
  expect(getSectionColor({ ...binding, lastValue: 40 })).toBe(Colors.impossible.string());
  expect(getSectionColor({ ...binding, lastValue: 60 })).toBe(Colors.impossible.string());
});

test('Should handle only optimum mark', () => {
  const binding = {
    minimum: undefined,
    optimum: 20,
    maximum: undefined,
    impossible: undefined,
  };
  expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(Colors.none.string());
  expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(Colors.none.string());
  expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Colors.none.string());
});

test('Should handle optimum and impossible marks', () => {
  const binding = {
    minimum: undefined,
    optimum: 20,
    maximum: undefined,
    impossible: 40,
  };
  expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(Colors.none.string());
  expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(Colors.optimum.string());
  expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Mixes.OptImp);
  expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(Colors.impossible.string());
});

test('Should handle optimum and maximum marks', () => {
  const binding = {
    minimum: undefined,
    optimum: 20,
    maximum: 40,
    impossible: undefined,
  };
  expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(Colors.none.string());
  expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(Colors.optimum.string());
  expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Mixes.OptMax);
  expect(getSectionColor({ ...binding, lastValue: 40 })).toBe(Colors.maximum.string());
  expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(Colors.maximum.string());
});

test('Should handle unknown minimum', () => {
  const binding = {
    minimum: undefined,
    optimum: 20,
    maximum: 40,
    impossible: 60,
  };
  expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(Colors.none.string());
  expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(Colors.optimum.string());
  expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Mixes.OptMax);
  expect(getSectionColor({ ...binding, lastValue: 40 })).toBe(Colors.maximum.string());
  expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(Mixes.MaxImp);
  expect(getSectionColor({ ...binding, lastValue: 60 })).toBe(Colors.impossible.string());
  expect(getSectionColor({ ...binding, lastValue: 70 })).toBe(Colors.impossible.string());
});

test('Should handle only minimum', () => {
  const binding = {
    minimum: 20,
    optimum: undefined,
    maximum: undefined,
    impossible: undefined,
  };
  expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(Colors.minimum.string());
  expect(getSectionColor({ ...binding, lastValue: 20 })).toBe(Colors.none.string());
  expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Colors.none.string());
});

test('Should handle minimum and impossible', () => {
  const binding = {
    minimum: 20,
    optimum: undefined,
    maximum: undefined,
    impossible: 40,
  };
  expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(Colors.minimum.string());
  expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Colors.none.string());
  expect(getSectionColor({ ...binding, lastValue: 40 })).toBe(Colors.impossible.string());
  expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(Colors.impossible.string());
});

test('Should handle minimum and maximum', () => {
  const binding = {
    minimum: 20,
    optimum: undefined,
    maximum: 40,
    impossible: undefined,
  };
  expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(Colors.minimum.string());
  expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Colors.none.string());
  expect(getSectionColor({ ...binding, lastValue: 40 })).toBe(Colors.maximum.string());
  expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(Colors.maximum.string());
});

test('Should handle unknown optimum', () => {
  const binding = {
    minimum: 20,
    optimum: undefined,
    maximum: 40,
    impossible: 60,
  };
  expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(Colors.minimum.string());
  expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Colors.none.string());
  expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(Mixes.MaxImp);
  expect(getSectionColor({ ...binding, lastValue: 70 })).toBe(Colors.impossible.string());
});

test('Should handle minimum and optimum', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: undefined,
    impossible: undefined,
  };
  expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(Colors.minimum.string());
  expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Mixes.MinOpt);
  expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(Colors.none.string());
});

test('Should handle unknown maximum', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: undefined,
    impossible: 60,
  };
  expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(Colors.minimum.string());
  expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Mixes.MinOpt);
  expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(Mixes.OptImp);
  expect(getSectionColor({ ...binding, lastValue: 70 })).toBe(Colors.impossible.string());
});

test('Should handle unknown impossible', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: 60,
    impossible: undefined,
  };
  expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(Colors.minimum.string());
  expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Mixes.MinOpt);
  expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(Mixes.OptMax);
  expect(getSectionColor({ ...binding, lastValue: 70 })).toBe(Colors.maximum.string());
});

test('Should handle all values known', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: 60,
    impossible: 80,
  };
  expect(getSectionColor({ ...binding, lastValue: 10 })).toBe(Colors.minimum.string());
  expect(getSectionColor({ ...binding, lastValue: 30 })).toBe(Mixes.MinOpt);
  expect(getSectionColor({ ...binding, lastValue: 50 })).toBe(Mixes.OptMax);
  expect(getSectionColor({ ...binding, lastValue: 70 })).toBe(Mixes.MaxImp);
  expect(getSectionColor({ ...binding, lastValue: 90 })).toBe(Colors.impossible.string());
});

test('Should handle sections without value', () => {
  const binding = {
    minimum: 20,
    optimum: 40,
    maximum: 60,
    impossible: 80,
  };
  expect(getSectionColor({ ...binding })).toBe(Colors.none.string());
  expect(getSectionColor({ ...binding, lastValue: null })).toBe(Colors.none.string());
  expect(getSectionColor({ ...binding, lastValue: 0 })).toBe(Colors.none.string());
});