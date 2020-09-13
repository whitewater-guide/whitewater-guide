import MailChimp from 'mailchimp-api-v3';

import { TopLevelResolver } from '~/apollo';

import logger from '../logger';

interface Vars {
  mail: string;
}

const mailSubscribe: TopLevelResolver<Vars> = async (_, { mail }) => {
  const mailchimp = new MailChimp(process.env.MAILCHIMP_API_KEY!);
  try {
    const { email_address, status } = await mailchimp.post(
      `/lists/${process.env.MAILCHIMP_LIST_ID}/members`,
      {
        email_address: mail,
        status: 'subscribed',
      },
    );
    logger.info(
      { emailAddress: email_address, status },
      'mailchimp subscription',
    );
  } catch (err) {
    logger.error({ message: 'mailchimp.failed', extra: { mail }, error: err });
    return false;
  }
  return true;
};

export default mailSubscribe;
