import { RequestResetPayload } from '@whitewater-guide/clients';
import * as yup from 'yup';

let _schema: yup.SchemaOf<RequestResetPayload>;

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
