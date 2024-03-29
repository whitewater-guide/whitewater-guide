import { MailType } from '../types';
import { render } from './render';

require('jest-specific-snapshot');
const { addSerializer } = require('jest-specific-snapshot');
addSerializer(require('jest-serializer-html'));

const types = Object.values(MailType).map((t) => [t]);

it.each(types)('should match snapshot for "%s"', async (type: any) => {
  const data = {
    email: 'test@mail.com',
    baseURL: 'https://api.whitewater.guide',
    contentURL: 'https://content.whitewater.guide',
    deepLinkingURL: 'https://app.whitewater.guide',
    user: {
      id: '__user_id__',
      name: 'User Name',
    },
    token: {
      raw: '__token__',
    },
    unhealthyMsg: 'unhealthy',
    code: 'WWGPucon1',
  };
  // eslint-disable-next-line testing-library/render-result-naming-convention
  const html = await render(type, data);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  expect(html).toMatchSpecificSnapshot(`./__snapshots__/${type}.htmlsnap`);
});
