import { Credentials } from '@whitewater-guide/clients';
import { PASSWORD_MIN_LENGTH } from '@whitewater-guide/commons';
import * as yup from 'yup';

const schema = yup.object<Credentials>().shape({
  email: yup.string().email().required(),
  password: yup.string().trim().min(PASSWORD_MIN_LENGTH).required(),
});

export default schema;
