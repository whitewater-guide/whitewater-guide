export async function flushPromises(ticks: number = 1) {
  for (let i = 0; i < ticks; i++) {
    await flushPromise();
  }
}

// function flushPromise() {
//   return new Promise((resolve) => setTimeout(resolve, 0));
// }
function flushPromise() {
  return new Promise((resolve) => setImmediate(resolve));
}
