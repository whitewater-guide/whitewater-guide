import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import { MailType, sendMail } from '~/mail';

import { testGenerateCampaignCode } from './generateCampaignCode.test.generated';

jest.mock('~/mail');

const _mutation = gql`
  mutation generateCampaignCode($campaign: String!) {
    generateCampaignCode(campaign: $campaign)
  }
`;

beforeEach(async () => {
  await holdTransaction();
  jest.clearAllMocks();
});

afterEach(rollbackTransaction);

it('should fail for unknown campaing', async () => {
  const result = await testGenerateCampaignCode({ campaign: 'test' });
  expect(result).toHaveGraphqlError(ApolloErrorCodes.BAD_USER_INPUT);
});

it('should generate codes', async () => {
  let result = await testGenerateCampaignCode({ campaign: 'pucon' });
  expect(result.errors).toBeUndefined();
  expect(result.data?.generateCampaignCode).toBe('pucon_0001');

  result = await testGenerateCampaignCode({ campaign: 'pucon' });
  expect(result.errors).toBeUndefined();
  expect(result.data?.generateCampaignCode).toBe('pucon_0002');
});

it('should send email', async () => {
  await testGenerateCampaignCode({ campaign: 'pucon' });
  expect(sendMail).toHaveBeenCalledWith(
    MailType.PUCON_PROMO_GENERATED,
    ['test1@yandex.ru', 'test2@whitewater.guide'],
    {
      code: 'pucon_0003',
    },
  );
});
