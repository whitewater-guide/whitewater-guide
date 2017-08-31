import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function isCoordinated3d(validationOptions?: ValidationOptions) {
  // tslint:disable-next-line:ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isCoordinated3d',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return Array.isArray(value) &&
            value.length === 3 &&
            value[0] >= -180 && value[0] <= 180 &&
            value[0] >= -90 && value[1] <= 90 &&
            typeof value[2] === 'number';
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be valid [lng, lat, alt]`;
        },
      },
    });
  };
}
