import { GraphQLScalarType, Kind } from 'graphql';
import isNil from 'lodash/isNil';

const VERSION = 'v1';
const SEPARATOR = ':';

export interface Cursor {
  ordId: number;
  value: string;
}

export const encodeCursor = ({ ordId, value }: Cursor) => {
  const parts = [VERSION, ordId];
  if (!isNil(value)) {
    parts.push(value);
  }
  return Buffer.from(parts.join(SEPARATOR), 'utf8').toString('base64');
};

export const decodeCursor = (cursor?: string): Cursor | undefined => {
  if (!cursor) {
    return undefined;
  }
  const buffer = Buffer.from(cursor, 'base64');
  const str = buffer.toString('utf8');
  const parts = str.split(SEPARATOR);
  if (parts.length !== 3) {
    throw new Error(`Incorrect cursor: ${cursor}`);
  }
  return {
    ordId: parseInt(parts[1], 10),
    value: parts[2],
  };
};

export const CursorScalar = new GraphQLScalarType({
  name: 'Cursor',
  description: 'Relay pagination cursor',
  parseValue(value?: string) {
    return decodeCursor(value) || null; // value from the client input variables
  },
  serialize(value: Cursor) {
    return encodeCursor(value); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return decodeCursor(ast.value) || null; // value from the client query
    }
    return null;
  },
});
