import { snakeCase } from 'lodash';
import { Context } from '../apollo';

export type ColumnMap<T> = {
  [field in keyof T]?: (context?: Context) => any;
};

export const getPrimitives = <T>(
  topLevelFields: Array<keyof T>,
  prefix: string,
  context?: Context,
  connections?: Array<keyof T>,
  customMap?: ColumnMap<T>,
): string[] => {
  return topLevelFields.reduce((result, field) => {
    // connection types and __typename are ignored
    if (field === '__typename' || connections && connections.includes(field)) {
      return result;
    }
    // Custom map allows to conditionally drop some statements based on context
    if (customMap && field in customMap) {
      const mapped = customMap[field]!(context);
      return mapped ?  [...result, `${prefix}.${mapped}`] : result;
    }
    return [...result, `${prefix}.${snakeCase(field)}`];
  }, []);
};
