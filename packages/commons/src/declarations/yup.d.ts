import { Schema } from 'yup';

declare module 'yup' {
  type Defined<T> = T extends undefined ? never : T;

  export interface MixedSchema<T = any> extends Schema<T> {
    defined(): MixedSchema<Defined<T>>;
  }
  export interface StringSchema<T extends string | null | undefined = string>
    extends Schema<T> {
    defined(): StringSchema<Defined<T>>;
  }
  export interface ObjectSchema<T extends object | null | undefined = object>
    extends Schema<T> {
    defined(): ObjectSchema<Defined<T>>;
  }

  export interface ArraySchema<T> {
    defined(): Defined<ArraySchema<T>>;
  }

  export interface NumberSchema<T extends number | null | undefined = number>
    extends Schema<T> {
    defined(): NumberSchema<Defined<T>>;
  }

  export interface BooleanSchema<
    T extends boolean | null | undefined = boolean
  > extends Schema<T> {
    defined(): BooleanSchema<Defined<T>>;
  }
}
