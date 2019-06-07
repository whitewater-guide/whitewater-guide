import core from './core';
import faq from './faq';
import privacyPolicy from './privacy_policy';
import termsAndConditions from './terms_and_conditions';

export default {
  ...core,
  markdown: {
    faq,
    privacyPolicy,
    termsAndConditions,
  },
};
