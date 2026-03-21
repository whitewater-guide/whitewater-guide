import axios from 'axios';

import type { MutationResolvers } from '../../../apollo/index';
import config from '../../../config';
import logger from '../logger';

const mailSubscribe: MutationResolvers['mailSubscribe'] = async (
  _,
  { mail },
) => {
  try {
    // https://mailchimp.com/developer/marketing/api/list-members/add-member-to-list/
    const dc = config.MAILCHIMP_API_KEY.split('-')[1];
    const resp = await axios.post(
      `https://${dc}.api.mailchimp.com/3.0/lists/${config.MAILCHIMP_LIST_ID}/members`,
      {
        email_address: mail,
        status: 'subscribed',
      },
    );
    logger.debug({ resp: resp.data }, 'mailchimp subscription');
    if (resp.data?.status !== 'subscribed') {
      logger.error({
        message: 'mailchimp.failed',
        extra: { mail },
        error: new Error(resp?.data?.detail),
      });
      return false;
    }
  } catch (err: any) {
    logger.error({ message: 'mailchimp.failed', extra: { mail }, error: err });
    return false;
  }
  return true;
};

export default mailSubscribe;
