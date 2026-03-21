import { flatten, unflatten } from 'flat';

import map from './remap.json';

const remap = (res: Record<string, any>) => {
  const flatMap: Record<string, any> = flatten(map);
  const flatRes: Record<string, any> = flatten(res);
  Object.entries(flatMap).forEach(([to, from]) => {
    const fromPath = from.replace(':', '.');
    const old = flatRes[fromPath];
    delete flatRes[fromPath];
    flatRes[to] = old;
  });
  return unflatten(flatRes);
};

export default (allLangs: Record<string, any>) =>
  Object.entries(allLangs).reduce(
    (acc, [lng, res]) => ({ ...acc, [lng]: remap(res) }),
    {},
  );
