import '../../../forms/password-field/zxcvbnSetup';

import type { ResetPayload } from '@whitewater-guide/clients';
import { PASSWORD_MIN_SCORE } from '@whitewater-guide/commons';
import { zxcvbn } from '@zxcvbn-ts/core';
import { object, type ObjectSchema, string } from 'yup';

let _schema: ObjectSchema<ResetPayload>;

const getValidationSchema = () => {
  if (!_schema) {
    _schema = object()
      .shape({
        id: string().required(),
        token: string().required(),
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
      })
      .defined();
  }
  return _schema;
};

export default getValidationSchema;
