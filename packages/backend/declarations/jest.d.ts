declare namespace jest {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface Matchers<R, T> {
    toHaveGraphqlError: (code?: string, message?: string) => R;
    toHaveGraphqlValidationError: (message?: string) => R;
  }
}
