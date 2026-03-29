import type { RequestResetPayload } from '@whitewater-guide/clients';
import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

let _schema: ObjectSchema<RequestResetPayload>;

const getValidationSchema = () => {
  if (!_schema) {
    _schema = object()
      .shape({
        email: string().email().required(),
      })
      .defined();
  }
  return _schema;
};

export default getValidationSchema;
