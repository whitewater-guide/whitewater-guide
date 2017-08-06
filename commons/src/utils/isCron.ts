import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import * as cronParser from 'cron-parser';

export function isCron(validationOptions?: ValidationOptions) {
  // tslint:disable-next-line:ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isCron',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') {
            return false;
          }
          try {
            cronParser.parseExpression(value);
            return true;
          } catch (e) {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be valid crontab expression`;
        },
      },
    });
  };
}
