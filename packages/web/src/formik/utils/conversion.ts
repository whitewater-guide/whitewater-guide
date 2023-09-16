import type { NamedNode, Node } from '@whitewater-guide/schema';

export const toNode = <T extends Node>({ id }: T): Node => ({ id });
export const toNamedNode = <T extends NamedNode>({
  id,
  name,
}: T): NamedNode => ({
  id,
  name,
});

export const toJSON = (
  value?:
    | string
    | null
    | {
        [key: string]: any;
      },
) => (value ? (typeof value === 'object' ? value : JSON.parse(value)) : null);

export const fromJSON = (value: any): string | null =>
  value ? (typeof value === 'string' ? value : JSON.stringify(value)) : null;
