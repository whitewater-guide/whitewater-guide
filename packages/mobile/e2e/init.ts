// tslint:disable:no-submodule-imports
import detox from 'detox';
import adapter from 'detox/runners/jest/adapter';
import specReporter from 'detox/runners/jest/specReporter';
import config from '../package.json';

// Set the default timeout
jest.setTimeout(120000);

// @ts-ignore
jasmine.getEnv().addReporter(adapter);

// This takes care of generating status logs on a per-spec basis. By default, jest only reports at file-level.
// This is strictly optional.
// @ts-ignore
jasmine.getEnv().addReporter(specReporter);

beforeAll(async () => {
  await detox.init(config.detox);
}, 300000);

beforeEach(async () => {
  await adapter.beforeEach();
});

afterAll(async () => {
  await adapter.afterAll();
  await detox.cleanup();
});
