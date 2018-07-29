import { Connection } from '@ww-commons';
import { FieldResolvers } from './types';

interface WithCount {
  count: number;
}

export const listResolvers: FieldResolvers<WithCount[], Connection<object>> = {
  nodes: list => list,
  count: list => list.length ? Number(list[0].count) : 0,
};
