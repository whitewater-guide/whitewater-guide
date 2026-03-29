import type { RegisterPayload } from '@whitewater-guide/clients';
import { PASSWORD_MIN_SCORE } from '@whitewater-guide/commons';
import { zxcvbn } from '@zxcvbn-ts/core';
import '../../../forms/password-field/zxcvbnSetup';
import type { ObjectSchema } from 'yup';
import { bool, object, string } from 'yup';

let _schema: ObjectSchema<RegisterPayload>;

const getValidationSchema = () => {
  if (!_schema) {
    _schema = object()
      .shape({
        email: string().email().required(),
        name: string().min(2).trim().required(),
        password: string()
          .test(
            'is-password',
            'yup:yup:string.weak_password',
            (value?: string) => {
              const result = zxcvbn(value || '');
              return result.score >= PASSWORD_MIN_SCORE;
            },
          )
          .required(),
        imperial: bool().optional(),
        language: string().optional(),
      })
      .defined();
  }
  return _schema;
};

export default getValidationSchema;
