import customMatchers from './test/customMatchers';

const jestExpect: jest.Expect = (global as any).expect;
jest.mock('./src/s3/imgproxy');

if (jestExpect !== undefined) {
  jestExpect.extend(customMatchers);
} else {
  console.error("Unable to find Jest's global expect.");
}
