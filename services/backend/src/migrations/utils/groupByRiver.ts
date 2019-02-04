import isFunction from 'lodash/isFunction';

type NameGetter<T> = (value: T) => string;

export const groupByRiver = <T>(
  sections: T[],
  getRiveName: keyof T | NameGetter<T>,
): Map<string, T[]> => {
  const byRiver = new Map<string, T[]>();
  sections.forEach((s) => {
    const riverName: string = isFunction(getRiveName)
      ? getRiveName(s)
      : (s[getRiveName] as any);
    const riverSections = byRiver.get(riverName) || [];
    byRiver.set(riverName, [...riverSections, s]);
  });
  return byRiver;
};
