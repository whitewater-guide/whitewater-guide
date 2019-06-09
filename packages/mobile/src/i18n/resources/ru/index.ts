import commons from './commons.json';
import faq from './faq';
import main from './main.json';
import yup from './yup.json';

export default {
  ...main,
  commons,
  markdown: {
    faq,
  },
  yup,
};
