declare module 'http-shutdown' {
  import { Server } from 'http';

  interface Shutdownable {
    shutdown: (callback?: () => void) => void;
  }
  function httpShutdown(server: Server): Server & Shutdownable;
  export = httpShutdown;
}
