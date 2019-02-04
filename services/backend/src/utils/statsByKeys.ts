import chalk from 'chalk';
import identity from 'lodash/identity';

interface PrettyKey<T extends object> {
  key: keyof T;
  name: string;
  transform?: (v: any) => any;
}

export const statsByKeys = <T extends object>(
  collection: T[],
  keys: Array<PrettyKey<T>>,
) => {
  const result = new Map<PrettyKey<T>, Map<any, number>>();
  for (const i of collection) {
    for (const k of keys) {
      const byValue = result.get(k) || new Map();
      const { key, transform = identity } = k;
      const value = transform(i[key]);
      const valueCount = byValue.get(value) || 0;
      byValue.set(value, valueCount + 1);
      result.set(k, byValue);
    }
  }
  return result;
};

export const prettyPrintStats = (
  stats: Map<PrettyKey<any>, Map<any, number>>,
  // tslint:disable-next-line:no-console
  log: (v: string) => void = console.log,
) => {
  for (const [{ name }, byValue] of stats) {
    log(`\t${chalk.green(name)}:`);
    for (const [value, count] of byValue) {
      log(`\t\t${value}: ${count}`);
    }
  }
};
