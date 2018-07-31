// tslint:disable-next-line:no-namespace
declare namespace jest {

  interface Matchers<R> {
    toHaveGraphqlError(code?: string, message?: string): R;
    toHaveGraphqlValidationError(message?: string): R;
  }
}
