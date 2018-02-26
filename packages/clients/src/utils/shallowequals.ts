// This is https://github.com/dashed/shallowequal adapted to work with typescript esnext modules

type Comparator = (valA: any, valB: any, key: string) => boolean | undefined;

export const shallowEqual = (objA: any, objB: any, compare: Comparator, compareContext?: any) => {

  let ret = compare ? compare.call(compareContext, objA, objB) : void 0;

  if (ret !== void 0) {
    return !!ret;
  }

  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || !objA ||
    typeof objB !== 'object' || !objB) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

  // Test for A's keys different from B.
  // tslint:disable-next-line:prefer-for-of
  for (let idx = 0; idx < keysA.length; idx++) {

    const key = keysA[idx];

    if (!bHasOwnProperty(key)) {
      return false;
    }

    const valueA = objA[key];
    const valueB = objB[key];

    ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

    if (ret === false ||
      ret === void 0 && valueA !== valueB) {
      return false;
    }

  }

  return true;

};
