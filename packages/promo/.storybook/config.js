import React from 'react';
import { addDecorator, configure } from '@storybook/react';
import { withRoot } from '../src/theme';
import '../src/i18n';

const Root = withRoot('div');

addDecorator((story) => <Root>{story()}</Root>);

const req = require.context('../src', true, /.stories.tsx/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
