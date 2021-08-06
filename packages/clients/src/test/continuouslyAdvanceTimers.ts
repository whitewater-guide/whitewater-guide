const _setTimeout = global.setTimeout;
/**
 * Function to work around jest's limitations when testing promises and timeouts
 * https://github.com/facebook/jest/issues/7151#issuecomment-463370069
 */
export function continuouslyAdvanceTimers() {
  let isCancelled = false;

  async function advance() {
    // eslint-disable-next-line no-unmodified-loop-condition
    while (!isCancelled) {
      jest.runOnlyPendingTimers();
      await new Promise((r) => {
        _setTimeout(r, 1);
      });
    }
  }

  advance();
  return () => {
    isCancelled = true;
  };
}
