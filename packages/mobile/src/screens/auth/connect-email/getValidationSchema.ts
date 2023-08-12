import { PASSWORD_MIN_SCORE } from '@whitewater-guide/commons';
import * as zxcvbn from 'react-native-zxcvbn';
import * as yup from 'yup';

import { ConnectEmailMutationVariables } from './connectEmail.generated';

let _schema: yup.SchemaOf<ConnectEmailMutationVariables>;

const getValidationSchema = () => {
  if (!_schema) {
    _schema = yup
      .object()
      .shape({
        email: yup.string().email().required(),
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
