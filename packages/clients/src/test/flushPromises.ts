// function flushPromise() {
//   return new Promise((resolve) => setTimeout(resolve, 0));
// }
function flushPromise() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

export async function flushPromises(ticks = 1) {
  for (let i = 0; i < ticks; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await flushPromise();
  }
}
