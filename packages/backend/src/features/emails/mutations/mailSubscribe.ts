import MailChimp from 'mailchimp-api-v3';

import type { MutationResolvers } from '../../../apollo/index';
import config from '../../../config';
import logger from '../logger';

const mailSubscribe: MutationResolvers['mailSubscribe'] = async (
  _,
  { mail },
) => {
  const mailchimp = new MailChimp(config.MAILCHIMP_API_KEY);
  try {
    const { email_address, status } = await mailchimp.post(
      `/lists/${config.MAILCHIMP_LIST_ID}/members`,
      {
        email_address: mail,
        status: 'subscribed',
      },
    );
    logger.info(
      { emailAddress: email_address, status },
      'mailchimp subscription',
    );
  } catch (err: any) {
    logger.error({ message: 'mailchimp.failed', extra: { mail }, error: err });
    return false;
  }
  return true;
};

export default mailSubscribe;
