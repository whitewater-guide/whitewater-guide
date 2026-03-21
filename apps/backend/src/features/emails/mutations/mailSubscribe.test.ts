import axios from 'axios';
import { gql } from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '../../../db/index';
import { testMailSubscribe } from './mailSubscribe.test.generated';

jest.mock('axios');

const _mutation = gql`
  mutation mailSubscribe($mail: String!) {
    mailSubscribe(mail: $mail)
  }
`;

beforeEach(async () => {
  await holdTransaction();
  (axios.post as jest.Mock).mockResolvedValue({
    data: {
      email_address: 'test@test.com',
      status: 'subscribed',
    },
  });
});

afterEach(rollbackTransaction);

it('should call mailchimp api', async () => {
  const result = await testMailSubscribe({ mail: 'test@test.com' });
  expect(axios.post).toHaveBeenCalledTimes(1);
  expect((axios.post as jest.Mock).mock.calls[0]).toMatchSnapshot();
  expect(result.errors).toBeUndefined();
  expect(result.data?.mailSubscribe).toBe(true);
});
