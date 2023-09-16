/* eslint-disable @typescript-eslint/method-signature-style */
import type { AnyObject, Flags, Maybe, Schema } from 'yup';

declare module 'yup' {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext = AnyObject,
    TDefault = undefined,
    TFlags extends Flags = '',
  > extends Schema<TType, TContext, TDefault, TFlags> {
    cron(errorMessage?: string): this;
    formula(errorMessage?: string): this;
    https(errorMessage?: string): this;
    jsonString(errorMessage?: string): this;
    nonEmpty(
      errorMessage?: string,
    ): StringSchema<NonNullable<TType>, TContext, TDefault, TFlags>;
    slug(errorMessage?: string): this;
    isoDate(errorMessage?: string): this;
  }
}
