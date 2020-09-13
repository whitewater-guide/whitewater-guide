declare namespace jest {
  interface Matchers<R, T> {
    toHaveGraphqlError(code?: string, message?: string): R;
    toHaveGraphqlValidationError(message?: string): R;
  }
}
