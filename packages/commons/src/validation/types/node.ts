import * as yup from 'yup';
import uuid from './uuid';

const node = () =>
  yup.object({
    id: uuid(),
  });

export default node;
