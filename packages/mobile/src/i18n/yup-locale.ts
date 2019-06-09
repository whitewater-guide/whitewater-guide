export let mixed = {
  default: 'yup:mixed.default',
  required: 'yup:mixed.required',
  oneOf: ({ values }: any) => ({ key: 'yup:mixed.oneOf', options: { values } }),
  notOneOf: ({ values }: any) => ({
    key: 'yup:mixed.notOneOf',
    options: { values },
  }),
  // notType: ({ path, type, value, originalValue }) => {
  notType: ({ type }: any) => ({ key: 'yup:mixed.notType', options: { type } }),
};

// tslint:disable-next-line:variable-name
export let string = {
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

// tslint:disable-next-line:variable-name
export let number = {
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

export let date = {
  min: ({ path, min }: any) => ({
    key: 'yup:date.min',
    options: { path, min },
  }),
  max: ({ path, max }: any) => ({
    key: 'yup:date.max',
    options: { path, max },
  }),
};

// tslint:disable-next-line:variable-name
export let boolean = {};

export let object = {
  noUnknown: ({ path }: any) => ({
    key: 'yup:object.noUnknown',
    options: { path },
  }),
};

export let array = {
  min: ({ path, min }: any) => ({
    key: 'yup:array.min',
    options: { path, min },
  }),
  max: ({ path, max }: any) => ({
    key: 'yup:array.max',
    options: { path, max },
  }),
};

const yupLocale: any = {
  mixed,
  string,
  number,
  date,
  object,
  array,
  boolean,
};

export default yupLocale;
