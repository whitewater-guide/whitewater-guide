import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isUUID from 'validator/lib/isUUID';
import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

const NEW_RIVER_ID = '__NEW_RIVER_ID__';

export interface NewNode {
  id: string;
  name?: string | null;
}

const newNode = (): ObjectSchema<NewNode> =>
  object({
    id: string().required(),
    name: string(),
  }).test({
    name: 'is-new-node',
    message: 'yup:mixed.newNode',
    test(v: unknown) {
      if (!v || !isObject(v)) {
        return false;
      }
      const { id, name } = v as NewNode;
      if (!id || !isString(id)) {
        return false;
      }
      // __NEW_ID__ is legacy input, required to support old mobile app versions
      if (id === NEW_RIVER_ID || id === '__NEW_ID__') {
        return !!name && isString(name) && name.length > 0;
      }
      return isUUID(id);
    },
  });

export default newNode;
