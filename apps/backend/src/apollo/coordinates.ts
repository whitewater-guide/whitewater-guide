import { GraphQLScalarType, isValueNode, Kind } from 'graphql';

export type Coordinates = CodegenCoordinates;

export const CoordinatesScalar = new GraphQLScalarType({
  name: 'Coordinates',
  description: 'Longitude, Latitude, Altitude',
  // parses value from the client input variables
  // Altitude is optional and defaults to zero
  parseValue(value?: Array<number | null | undefined>): Coordinates | null {
    if (!value) {
      return null;
    }
    const [lng, lat, alt] = value;
    return [lng ?? 0, lat ?? 0, alt ?? 0];
  },
  // Send value to client. Altitude is always number
  serialize(value: Coordinates) {
    return value;
  },
  parseLiteral(ast): Coordinates | null {
    // value from the client query
    if (isValueNode(ast) && ast.kind === 'ListValue') {
      const [lng, lat, alt] = ast.values.map((v) => {
        if (v.kind === Kind.FLOAT) {
          return parseFloat(v.value);
        }
        return 0;
      });
      return [lng ?? 0, lat ?? 0, alt ?? 0];
    }
    return null;
  },
});
