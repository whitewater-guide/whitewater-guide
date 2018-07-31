import customMatchers from './customMatchers';

const jestExpect: jest.Expect = (global as any).expect;

if (jestExpect !== undefined) {
  jestExpect.extend(customMatchers);
} else {
  console.error("Unable to find Jest's global expect.");
}
