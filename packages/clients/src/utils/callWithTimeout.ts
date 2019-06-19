export const callWithTimeout = async <T>(
  func: () => Promise<T>,
  timeout?: number,
  timeoutValue?: T,
): Promise<T> => {
  if (!timeout) {
    return func();
  }
  const result: any = await Promise.race([
    func(),
    new Promise((resolve, reject) =>
      setTimeout(() => {
        if (timeoutValue) {
          resolve(timeoutValue);
        } else {
          reject(new Error(`timed out (${timeout} ms)`));
        }
      }, timeout),
    ),
  ]);
  return result;
};
