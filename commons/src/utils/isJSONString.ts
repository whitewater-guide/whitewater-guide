import * as Joi from 'joi';

export const isJSONString = (input: any) => {
  try {
    const o = JSON.parse(input);
    if (o && typeof o === 'object') {
      return true;
    }
  } catch (e) {}
  return false;
};

export const JoiWithJSONString = Joi.extend({
  base: Joi.string(),
  name: 'string',
  language: {
    isCron: 'must be valid JSON string',
  },
  rules: [
    {
      name: 'isJSONString',
      validate(this: Joi.ExtensionBoundSchema, params: any, value: any, state: any, options: any) {
        return isJSONString(value) ?
          value :
          // tslint:disable-next-line:no-invalid-this
          this.createError('string.isJSONString', { v: value }, state, options);
      },
    },
  ],
});
