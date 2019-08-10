import * as yup from 'yup';

const varchar = () => yup.string().max(255, 'yup:varchar.length');

export default varchar;
