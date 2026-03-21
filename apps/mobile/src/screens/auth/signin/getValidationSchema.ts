import type { Credentials } from '@whitewater-guide/clients';
import { PASSWORD_MIN_LENGTH } from '@whitewater-guide/commons';
import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

let _schema: ObjectSchema<Credentials>;

const getValidationSchema = () => {
  if (!_schema) {
    _schema = object()
      .shape({
        email: string().email().required(),
        password: string().trim().min(PASSWORD_MIN_LENGTH).required(),
      })
      .defined();
  }
  return _schema;
};

export default getValidationSchema;
