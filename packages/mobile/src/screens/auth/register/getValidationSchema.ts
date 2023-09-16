import type { RegisterPayload } from '@whitewater-guide/clients';
import { PASSWORD_MIN_SCORE } from '@whitewater-guide/commons';
import * as zxcvbn from 'react-native-zxcvbn';
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
            async (value?: string) => {
              const score = await zxcvbn.score(value);
              return score >= PASSWORD_MIN_SCORE;
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
