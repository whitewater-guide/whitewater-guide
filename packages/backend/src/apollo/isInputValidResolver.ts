import { createSafeValidator } from '@whitewater-guide/validation';
import { UserInputError } from 'apollo-server-koa';
import { GraphQLFieldResolver } from 'graphql';
import * as yup from 'yup';

import { Context } from './context';

export const isInputValidResolver = <TSource, Vars>(
  // It used to be schema: yup.SchemaOf<Vars>, but I had to relax it because it was incompatible with codegen's RequireFields in resolver
  // It caused errors like
  // TypeOfShape<{ gauge: ObjectSchemaOf<GaugeInput, never> | Lazy<ObjectSchemaOf<GaugeInput, never>, any>; }>' is not assignable to type
  // maybe it'll be fixed in future yup versions
  schema: yup.SchemaOf<unknown>,
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
