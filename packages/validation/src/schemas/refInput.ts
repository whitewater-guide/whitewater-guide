import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

export interface RefInput {
  id: string;
  name?: string | null;
}

const refInput = (): ObjectSchema<RefInput> =>
  object({
    id: string().uuid().defined().nonNullable(),
    name: string(),
  });

export default refInput;
