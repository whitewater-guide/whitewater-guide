import * as yup from 'yup';
import uuid from './uuid';

const namedNode = () =>
  yup.object({
    id: uuid(),
    name: yup.string(),
  });

export default namedNode;
