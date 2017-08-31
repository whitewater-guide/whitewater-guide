import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

interface ClassType {
  new (...args: any[]): any;
}

export const validateInput = (clazz: ClassType) => (object: any) => {
  const instance = plainToClass(clazz, object, { excludePrefixes: ['__'] });
  const result = validateSync(instance, { skipMissingProperties: true });
  console.log('Validation', result);
  return result;
};
