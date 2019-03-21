// tslint:disable:no-var-requires
import { MailType } from '../types';
import { render } from './render';

require('jest-specific-snapshot');
const addSerializer = require('jest-specific-snapshot').addSerializer;
addSerializer(require('jest-serializer-html'));

const types = Object.values(MailType).map((t) => [t]);

test.each(types)('should match snapshot for "%s"', async (type) => {
  const data = {
    baseURL: 'https://whitewater.guide',
    user: {
      id: '__user_id__',
      name: 'User Name',
    },
    token: {
      raw: '__token__',
    },
  };
  const html = await render(type, data);
  // @ts-ignore
  expect(html).toMatchSpecificSnapshot(`./__snapshots__/${type}.htmlsnap`);
});
