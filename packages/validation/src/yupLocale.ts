import { ValidationError } from 'yup';

export const mixed = {
  default: 'yup:mixed.default',
  defined: 'yup:mixed.defined',
  required: 'yup:mixed.required',
  nonNullable: 'yup:mixed.required',
  nonNull: 'yup:mixed.required',
  oneOf: ({ values }: any) => ({ key: 'yup:mixed.oneOf', options: { values } }),
  notOneOf: ({ values }: any) => ({
    key: 'yup:mixed.notOneOf',
    options: { values },
  }),
  // notType: ({ path, type, value, originalValue }) => {
  notType: ({ type }: any) => ({ key: 'yup:mixed.notType', options: { type } }),
};

export const string = {
  length: ({ length }: any) => ({
    key: 'yup:string.length',
    options: { length },
  }),
  min: ({ path, min }: any) => ({
    key: 'yup:string.min',
    options: { path, min },
  }),
  max: ({ path, max }: any) => ({
    key: 'yup:string.max',
    options: { path, max },
  }),
  matches: ({ regex }: any) => ({
    key: 'yup:string.matches',
    options: { regex },
  }),
  email: ({ path }: any) => ({ key: 'yup:string.email', options: { path } }),
  uuid: ({ path }: any) => ({ key: 'yup:string.uuid', options: { path } }),
  url: ({ path }: any) => ({ key: 'yup:string.url', options: { path } }),
  trim: ({ path }: any) => ({ key: 'yup:string.trim', options: { path } }),
  lowercase: ({ path }: any) => ({
    key: 'yup:string.lowercase',
    options: { path },
  }),
  uppercase: ({ path }: any) => ({
    key: 'yup:string.uppercase',
    options: { path },
  }),
};

export const number = {
  min: ({ path, min }: any) => ({
    key: 'yup:number.min',
    options: { path, min },
  }),
  max: ({ path, max }: any) => ({
    key: 'yup:number.max',
    options: { path, max },
  }),

  lessThan: ({ path, less }: any) => ({
    key: 'yup:number.lessThan',
    options: { path, less },
  }),
  moreThan: ({ path, more }: any) => ({
    key: 'yup:number.moreThan',
    options: { path, more },
  }),
  notEqual: ({ path, notEqual }: any) => ({
    key: 'yup:number.notEqual',
    options: { path, notEqual },
  }),

  positive: ({ path }: any) => ({
    key: 'yup:number.positive',
    options: { path },
  }),
  negative: ({ path }: any) => ({
    key: 'yup:number.negative',
    options: { path },
  }),
  integer: ({ path }: any) => ({
    key: 'yup:number.integer',
    options: { path },
  }),
};

export const date = {
  min: ({ path, min }: any) => ({
    key: 'yup:date.min',
    options: { path, min },
  }),
  max: ({ path, max }: any) => ({
    key: 'yup:date.max',
    options: { path, max },
  }),
};

export const boolean = {};

export const object = {
  noUnknown: ({ path }: any) => ({
    key: 'yup:object.noUnknown',
    options: { path },
  }),
};

export const array = {
  min: ({ path, min }: any) => ({
    key: 'yup:array.min',
    options: { path, min },
  }),
  max: ({ path, max }: any) => ({
    key: 'yup:array.max',
    options: { path, max },
  }),
};

export const tuple = {
  notType: (params: any) => {
    const { path, value, spec } = params;
    const size = spec.types.length;
    if (Array.isArray(value)) {
      if (value.length < size)
        return {
          key: 'yup:tuple.tooFew',
          options: { path, size },
        };
      if (value.length > size)
        return {
          key: 'yup:tuple.tooMany',
          options: { path, size },
        };
    }

    return ValidationError.formatError(mixed.notType, params);
  },
};

export const yupLocale: any = {
  array,
  boolean,
  date,
  mixed,
  number,
  object,
  string,
  tuple,
};
