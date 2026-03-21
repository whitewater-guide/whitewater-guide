import { type MutationResolvers, UserInputError } from '../../../apollo/index';
import config from '../../../config';
import { db } from '../../../db/index';
import { MailType, sendMail } from '../../../mail/index';
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
  code = 'WWGPucon' + code;

  if (config.PUCON_PROMO_EMAILS.length) {
    await sendMail(MailType.PUCON_PROMO_GENERATED, config.PUCON_PROMO_EMAILS, {
      code,
    });
  }

  return code;
};

export default generateCampaignCode;
