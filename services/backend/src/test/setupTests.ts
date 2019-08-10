import customMatchers from './customMatchers';

const jestExpect: jest.Expect = (global as any).expect;

if (jestExpect !== undefined) {
  jestExpect.extend(customMatchers);
} else {
  // tslint:disable-next-line:no-console
  console.error("Unable to find Jest's global expect.");
}

// https://github.com/stipsan/ioredis-mock/issues/568#issuecomment-492558489
jest.mock('ioredis', () => {
  const Redis = require('ioredis-mock');
  if (typeof Redis === 'object') {
    // the first mock is an ioredis shim because ioredis-mock depends on it
    // https://github.com/stipsan/ioredis-mock/blob/master/src/index.js#L101-L111
    return {
      Command: { _transformer: { argument: {}, reply: {} } },
    };
  }
  // second mock for our code
  // tslint:disable-next-line:only-arrow-functions
  return function(...args: any[]) {
    return new Redis(args);
  };
});
