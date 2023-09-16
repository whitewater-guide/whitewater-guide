import type { Credentials } from '@whitewater-guide/clients';
import { PASSWORD_MIN_LENGTH } from '@whitewater-guide/commons';
import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

const schema: ObjectSchema<Credentials> = object().shape({
  email: string().email().required(),
  password: string().trim().min(PASSWORD_MIN_LENGTH).required(),
});

export default schema;
