import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

import type { RequestConnectEmailMutationVariables } from './requestConnectEmail.generated';

let _schema: ObjectSchema<RequestConnectEmailMutationVariables>;

const getValidationSchema = () => {
  if (!_schema) {
    _schema = object()
      .shape({
        email: string().email().required(),
      })
      .defined();
  }
  return _schema;
};

export default getValidationSchema;
