import customMatchers from './customMatchers';

jest.mock('../redis/client');

const jestExpect: jest.Expect = (global as any).expect;

if (jestExpect !== undefined) {
  jestExpect.extend(customMatchers);
} else {
  // tslint:disable-next-line:no-console
  console.error("Unable to find Jest's global expect.");
}
