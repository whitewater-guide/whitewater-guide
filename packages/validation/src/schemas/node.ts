import { object, string } from 'yup';

const node = () =>
  object({
    id: string().uuid().defined().nonNullable(),
  });

export default node;
