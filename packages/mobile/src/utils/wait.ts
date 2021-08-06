export default (n: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, n);
  });
