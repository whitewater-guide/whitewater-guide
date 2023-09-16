import type { ResetPayload } from '@whitewater-guide/clients';
import { PASSWORD_MIN_SCORE } from '@whitewater-guide/commons';
import * as zxcvbn from 'react-native-zxcvbn';
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
            async (value?: string) => {
              const score = await zxcvbn.score(value);
              return score >= PASSWORD_MIN_SCORE;
            },
          )
          .required(),
      })
      .defined();
  }
  return _schema;
};

export default getValidationSchema;
