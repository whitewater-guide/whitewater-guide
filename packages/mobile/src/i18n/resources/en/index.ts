import commons from './commons.json';
import faq from './faq';
import main from './main.json';
import privacyPolicy from './privacy_policy';
import termsAndConditions from './terms_and_conditions';
import yup from './yup.json';

export default {
  ...main,
  commons,
  markdown: {
    faq,
    privacyPolicy,
    termsAndConditions,
  },
  yup,
};
