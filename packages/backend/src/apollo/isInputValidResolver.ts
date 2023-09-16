import { createSafeValidator } from '@whitewater-guide/validation';
import type { GraphQLFieldResolver } from 'graphql';
import type { Schema } from 'yup';

import type { Context } from './context';
import { UserInputError } from './errors';

export const isInputValidResolver = <TSource, Vars>(
  schema: Schema<Vars>,
  resolver: GraphQLFieldResolver<TSource, Context, Vars>,
): GraphQLFieldResolver<TSource, Context, Vars> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: it's because of Errors<Vars> is unknown
  const validator = createSafeValidator(schema);
  return (source, args, context, info) => {
    const validationErrors = validator(args);
    if (validationErrors) {
      throw new UserInputError('invalid input', { validationErrors, args });
    }
    return resolver(source, args, context, info);
  };
};
