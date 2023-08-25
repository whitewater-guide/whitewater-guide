import { UserInputError } from 'apollo-server-errors';
import padStart from 'lodash/padStart';

import { MutationResolvers } from '~/apollo';
import config from '~/config';
import { db } from '~/db';
import { MailType, sendMail } from '~/mail';

import logger from '../logger';

const generateCampaignCode: MutationResolvers['generateCampaignCode'] = async (
  _,
  { campaign },
) => {
  logger.info({ campaign }, 'generate campaign code');
  if (campaign !== 'pucon') {
    throw new UserInputError('bad campaign');
  }
  let { code } = await db()
    .select(db().raw(`nextval('pucon_promo') as code`))
    .first();
  code = 'WWGPucon' + padStart(code, 4, '0');

  if (config.PUCON_PROMO_EMAILS.length) {
    await sendMail(MailType.PUCON_PROMO_GENERATED, config.PUCON_PROMO_EMAILS, {
      code,
    });
  }

  return code;
};

export default generateCampaignCode;
