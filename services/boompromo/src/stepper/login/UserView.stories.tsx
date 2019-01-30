import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import UserView from './UserView';

storiesOf('UserView', module)
  .addDecorator((story) => <div style={{ width: 400 }}>{story()}</div>)
  .add('default', () => (
    <UserView
      user={{
        id: '1111',
        name: 'Ivan Ivanov',
        picture: {
          data: {
            url:
              'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-1/p160x160/1780622_1380926282175020_67535950_n.jpg?_nc_cat=0&_nc_eui2=AeHyXIZyU-vnhcOJPMs22iNGhja4jwQ7q37Ll9vjb5vNmct9CCjeuRLxSm_1L158HZo6B5RKughCcUrJyOwOpapm3XR6YlYPKDnBFjn8vyMDfA&oh=0758d1877f402ad4047be7d3c3ce20a1&oe=5BBC44F0',
          },
        },
      }}
      logout={action('logout')}
    />
  ));
