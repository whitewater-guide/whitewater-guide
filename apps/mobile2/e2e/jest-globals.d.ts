/**
 * Jest global type declarations for Detox E2E tests.
 *
 * We use only `detox` in tsconfig types (to get the correct `expect` type
 * with Detox matchers like `.toBeVisible()`). This file provides the Jest
 * test runner globals that Detox doesn't declare.
 */

declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => Promise<void> | void): void;
declare function test(name: string, fn: () => Promise<void> | void): void;
declare function beforeAll(
  fn: () => Promise<void> | void,
  timeout?: number,
): void;
declare function beforeEach(
  fn: () => Promise<void> | void,
  timeout?: number,
): void;
declare function afterAll(
  fn: () => Promise<void> | void,
  timeout?: number,
): void;
declare function afterEach(
  fn: () => Promise<void> | void,
  timeout?: number,
): void;
