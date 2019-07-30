import { Connection, NamedNode, Node } from '@whitewater-guide/commons';

export const toNode = <T extends Node>({ id }: T): Node => ({ id });
export const toNamedNode = <T extends NamedNode>({
  id,
  name,
}: T): NamedNode => ({
  id,
  name,
});
export const toNodes = <T extends Node>(array: T[]): Node[] =>
  array.map(toNode);

export type ConnectionsKeys<O> = keyof {
  [Key in keyof O]?: O[Key] extends Connection<any> ? Key : never;
};

export type ConnectionType<O> = O extends Connection<infer U> ? U : never;

export const squashConnection = <O, K extends ConnectionsKeys<O>>(
  data: O | undefined,
  key: K,
): Array<ConnectionType<O[K]>> => {
  if (!data) {
    return [];
  }
  const connection: Connection<any> | undefined = data[key];
  if (!connection) {
    return [];
  }
  return connection.nodes || [];
};

export const toJSON = (value?: string | null) =>
  value ? JSON.parse(value) : null;

export const fromJSON = (value: any) => (value ? JSON.stringify(value) : null);
