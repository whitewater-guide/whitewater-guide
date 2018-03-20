import cronParser from 'cron-parser';
// tslint:disable-next-line
import Joi from 'joi';

export const JoiWithCron = Joi.extend({
  base: Joi.string(),
  name: 'string',
  language: {
    isCron: 'must be valid crontab expression',
  },
  rules: [
    {
      name: 'isCron',
      validate(this: Joi.ExtensionBoundSchema, params: any, value: any, state: any, options: any) {
        try {
          cronParser.parseExpression(value);
          return value;
        } catch (e) {
          // tslint:disable-next-line:no-invalid-this
          return this.createError('string.isCron', { v: value }, state, options);
        }
      },
    },
  ],
});
