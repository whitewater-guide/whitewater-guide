declare module 'shallowequal' {
  type Comparator = (objA: any, objB: any, indexOrKey?: number | string) => boolean | undefined;

  function shallowEqual(objA: any, objB: any, compare?: Comparator, compareContext?: any): boolean;
  export = shallowEqual;
}
