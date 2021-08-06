import * as yup from 'yup';

const node = () =>
  yup.object({
    id: yup.string().uuid().defined().nullable(false),
  });

export default node;
