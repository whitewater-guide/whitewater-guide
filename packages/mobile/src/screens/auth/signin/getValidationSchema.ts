import { Credentials } from '@whitewater-guide/clients';
import { PASSWORD_MIN_LENGTH } from '@whitewater-guide/commons';
import * as yup from 'yup';

let _schema: yup.ObjectSchema<Credentials>;

const getValidationSchema = () => {
  if (!_schema) {
    _schema = yup.object().shape({
      email: yup
        .string()
        .email()
        .required(),
      password: yup
        .string()
        .trim()
        .min(PASSWORD_MIN_LENGTH)
        .required(),
    });
  }
  return _schema;
};

export default getValidationSchema;
