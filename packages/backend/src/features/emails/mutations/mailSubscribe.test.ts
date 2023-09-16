/* eslint-disable import/first */
const mockPost = jest.fn(() =>
  Promise.resolve({
    email_address: 'test@test.com',
    status: 'subscribed',
  }),
);
jest.mock('mailchimp-api-v3', () =>
  jest.fn().mockImplementation(() => ({ post: mockPost })),
);

import { gql } from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '../../../db/index';
import { testMailSubscribe } from './mailSubscribe.test.generated';

const _mutation = gql`
  mutation mailSubscribe($mail: String!) {
    mailSubscribe(mail: $mail)
  }
`;

beforeEach(async () => {
  await holdTransaction();
  jest.clearAllMocks();
});

afterEach(rollbackTransaction);

it('should call mailchimp api', async () => {
  const result = await testMailSubscribe({ mail: 'test@test.com' });
  expect(mockPost).toHaveBeenCalledTimes(1);
  expect(mockPost.mock.calls[0]).toMatchSnapshot();
  expect(result.errors).toBeUndefined();
  expect(result.data?.mailSubscribe).toBe(true);
});
