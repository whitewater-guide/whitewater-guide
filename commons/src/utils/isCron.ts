import * as cronParser from 'cron-parser';
import * as Joi from 'joi';

export const JoiWithCron = Joi.extend({
  base: Joi.string(),
  name: 'string',
  language: {
    isCron: 'must be valid crontab expression',
  },
  rules: [
    {
      name: 'isCron',
      validate(params: any, value: string, state: any, options: any) {
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
