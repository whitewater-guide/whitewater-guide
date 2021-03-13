import { ResetPayload } from '@whitewater-guide/clients';
import { PASSWORD_MIN_SCORE } from '@whitewater-guide/commons';
import * as zxcvbn from 'react-native-zxcvbn';
import * as yup from 'yup';

let _schema: yup.SchemaOf<ResetPayload>;

const getValidationSchema = () => {
  if (!_schema) {
    _schema = yup
      .object()
      .shape({
        id: yup.string().required(),
        token: yup.string().required(),
        password: yup
          .string()
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
