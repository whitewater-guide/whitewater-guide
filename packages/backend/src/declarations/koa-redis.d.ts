declare module 'koa-redis' {
  import { stores } from 'koa-session';

  interface RedisOptions {
    duplicate?: boolean;
    client?: any;
  }

  export default function redisStore(options: RedisOptions): stores;
}
