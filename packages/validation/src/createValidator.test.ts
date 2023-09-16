import { number, object, string } from 'yup';

import { createSafeValidator } from './createValidator';

const objectSchema = object({
  x: number(),
});

const stringSchema: any = string();

describe('default options', () => {
  it('should handle object schemas', () => {
    const validator = createSafeValidator(objectSchema);
    expect(validator({ x: 1 })).toBeNull();
    expect(validator({ x: 1, y: 2 })).not.toBeNull();
    expect(validator({ x: '1', y: 2 })).not.toBeNull();
    expect(validator({ x: 'foo' })).not.toBeNull();
    expect(validator('foo')).not.toBeNull();
  });

  it('should handle other schemas', () => {
    const validator = createSafeValidator(stringSchema);
    expect(validator({ foo: 'bar' })).not.toBeNull();
    expect(validator(1)).not.toBeNull();
    expect(validator('foo')).toBeNull();
  });
});

describe('noUnknown options', () => {
  it('should handle object schemas', () => {
    const validator = createSafeValidator(objectSchema, { noUnknown: false });
    expect(validator({ x: 1 })).toBeNull();
    expect(validator({ x: 1, y: 2 })).toBeNull();
    expect(validator({ x: '1', y: 2 })).not.toBeNull();
    expect(validator({ x: 'foo' })).not.toBeNull();
    expect(validator('foo')).not.toBeNull();
  });

  it('should handle other schemas', () => {
    const validator = createSafeValidator(stringSchema, { noUnknown: false });
    expect(validator({ foo: 'bar' })).not.toBeNull();
    expect(validator(1)).not.toBeNull();
    expect(validator('foo')).toBeNull();
  });
});

describe('loose options', () => {
  it('should handle object schemas', () => {
    const validator = createSafeValidator(objectSchema, {
      strict: false,
      noUnknown: false,
    });
    expect(validator({ x: 1 })).toBeNull();
    expect(validator({ x: 1, y: 2 })).toBeNull();
    expect(validator({ x: '1', y: 2 })).toBeNull();
    expect(validator({ x: 'foo' })).not.toBeNull();
    expect(validator('foo')).not.toBeNull();
  });

  it('should handle other schemas', () => {
    const validator = createSafeValidator(stringSchema, {
      strict: true,
      noUnknown: false,
    });
    expect(validator({ foo: 'bar' })).not.toBeNull();
    expect(validator('foo')).toBeNull();
    expect(validator(1)).not.toBeNull();
  });
});
