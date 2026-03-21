import 'koa';

declare module 'koa' {
  export interface ContextUser {
    id: string;
    admin: boolean;
    language: string;
    verified: boolean;
  }

  interface Request {
    user?: ContextUser;
  }
}
