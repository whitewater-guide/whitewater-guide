import * as yup from 'yup';
import { RequiredStringSchema } from 'yup/lib/string';
import { AnyObject, Maybe } from 'yup/lib/types';

declare module 'yup' {
  class StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType,
  > extends yup.BaseSchema<TType, TContext, TOut> {
    cron(errorMessage?: string): StringSchema<TType, TContext>;
    formula(errorMessage?: string): StringSchema<TType, TContext>;
    https(errorMessage?: string): StringSchema<TType, TContext>;
    jsonString(errorMessage?: string): StringSchema<TType, TContext>;
    nonEmpty(
      errorMessage?: string,
    ): RequiredStringSchema<Exclude<TType, null>, TContext>;
    slug(errorMessage?: string): StringSchema<TType, TContext>;
    isoDate(errorMessage?: string): StringSchema<TType, TContext>;
  }
}
