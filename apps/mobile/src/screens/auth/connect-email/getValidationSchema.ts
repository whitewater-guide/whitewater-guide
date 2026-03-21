import { PASSWORD_MIN_SCORE } from '@whitewater-guide/commons';
import * as zxcvbn from 'react-native-zxcvbn';
import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

import type { ConnectEmailMutationVariables } from './connectEmail.generated';

let _schema: ObjectSchema<ConnectEmailMutationVariables>;

const getValidationSchema = () => {
  if (!_schema) {
    _schema = object()
      .shape({
        email: string().email().required(),
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
