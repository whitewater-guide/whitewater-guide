import * as yup from 'yup';

interface RefInput {
  id: string;
  name?: string | null;
}

const refInput = (): yup.SchemaOf<RefInput> =>
  yup.object({
    id: yup.string().uuid().defined().nullable(false),
    name: yup.string().optional(),
  });

export default refInput;
