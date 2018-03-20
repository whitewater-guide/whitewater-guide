// tslint:disable-next-line
import Joi from 'joi';
import { TagInputSchema } from './validation';

const validate = (value: any) => Joi.validate(
  value,
  TagInputSchema,
  {
    noDefaults: true,
    stripUnknown: { objects: true, arrays: false },
    presence: 'required',
    abortEarly: false,
    convert: false,
  },
);

it('should fail for bad ids', () => {
  const ids = ['aa', 'яяяяяя', 'foo bar', 'fooo11'];
  ids.forEach(id => expect(validate({ id, name: 'Name', category: 'misc' }).error).toBeTruthy());
  expect.assertions(4);
});

it('should accept legacy ids', () => {
  const ids = ['Must-run', 'man_made'];
  ids.forEach(id => expect(validate({ id, name: 'Name', category: 'misc' }).error).toBeFalsy());
  expect.assertions(2);
});

it('should fail for bad category', () => {
  expect(validate({ id: 'ololol', name: 'Name', category: 'baz' }).error).toBeTruthy();
});
