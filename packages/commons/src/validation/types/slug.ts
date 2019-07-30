import * as yup from 'yup';

const SLUG_REGEX = /^[0-9a-zA-Z_\-]{3,64}$/;

const slug = () => yup.string().matches(SLUG_REGEX, 'yup:string.slug');

export default slug;
