const mockPost = jest.fn(() =>
  Promise.resolve({
    email_address: 'test@test.com',
    status: 'subscribed',
  }),
);
jest.mock('mailchimp-api-v3', () => {
  return jest.fn().mockImplementation(() => {
    return { post: mockPost };
  });
});

import { runQuery } from '@test';

import { holdTransaction, rollbackTransaction } from '~/db';

const mutation = `
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
  const result = await runQuery(mutation, { mail: 'test@test.com' });
  expect(mockPost).toHaveBeenCalledTimes(1);
  expect(mockPost.mock.calls[0]).toMatchSnapshot();
  expect(result.errors).toBeUndefined();
  expect(result.data!.mailSubscribe).toBe(true);
});
