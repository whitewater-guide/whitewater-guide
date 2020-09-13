export const compose = (...funcs: Function[]) =>
  funcs.reduce(
    (a: any, b: any) => (...args: any[]) => a(b(...args)),
    (arg: any) => arg,
  );
