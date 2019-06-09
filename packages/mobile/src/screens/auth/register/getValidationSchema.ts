import { RegisterPayload } from '@whitewater-guide/clients';
import { PASSWORD_MIN_SCORE } from '@whitewater-guide/commons';
import * as yup from 'yup';
import validatePassword from '../../../utils/validatePassword';

let _schema: yup.ObjectSchema<RegisterPayload>;

const getValidationSchema = () => {
  if (!_schema) {
    _schema = yup.object().shape({
      email: yup
        .string()
        .email()
        .required(),
      name: yup
        .string()
        .min(2)
        .trim()
        .required(),
      password: yup
        .string()
        .test(
          'is-password',
          'yup:yup:string.weak_password',
          (value?: string) => {
            return validatePassword(value) >= PASSWORD_MIN_SCORE;
          },
        )
        .required(),
    });
  }
  return _schema;
};

export default getValidationSchema;
