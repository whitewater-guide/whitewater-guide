import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isUUID from 'validator/lib/isUUID';
import * as yup from 'yup';

const NEW_RIVER_ID = '__NEW_RIVER_ID__';

interface NewNode {
  id: string;
  name?: string | null;
}

const newNode = (): yup.SchemaOf<NewNode> =>
  yup.mixed().test({
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
      if (id === NEW_RIVER_ID) {
        return !!name && isString(name) && name.length > 0;
      }
      return isUUID(id);
    },
  }) as unknown as yup.SchemaOf<NewNode>;

export default newNode;
