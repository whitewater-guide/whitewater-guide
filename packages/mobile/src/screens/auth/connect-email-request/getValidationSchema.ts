import * as yup from 'yup';

import { RequestConnectEmailMutationVariables } from './requestConnectEmail.generated';

let _schema: yup.SchemaOf<RequestConnectEmailMutationVariables>;

const getValidationSchema = () => {
  if (!_schema) {
    _schema = yup
      .object()
      .shape({
        email: yup.string().email().required(),
      })
      .defined();
  }
  return _schema;
};

export default getValidationSchema;
