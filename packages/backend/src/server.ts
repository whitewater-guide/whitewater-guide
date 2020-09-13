import httpShutdown from 'http-shutdown';

import log from '~/log';

import { App } from './app';

const PORT = 3333;
const HOST = '0.0.0.0';

export default function startServer(app: App) {
  const server = httpShutdown(
    app.listen(PORT, HOST, () => {
      log.info(`Example app listening on port ${PORT}!`);
    }),
  );

  interface Options {
    cleanup?: boolean;
    exit?: boolean;
  }

  // Graceful shutdown: https://stackoverflow.com/a/14032965/6212547
  function gracefulShutdown({ cleanup, exit }: Options, error: any) {
    if (error) {
      log.error(error);
    }
    if (cleanup) {
      app.shutdown().finally(() => {
        server.shutdown(() => {
          if (exit) {
            log.info('Shutting down after cleanup');
            process.exit();
          }
        });
      });
    } else if (exit) {
      log.info('Shutting down');
      process.exit();
    }
  }

  process.on('exit', gracefulShutdown.bind(null, { cleanup: true }));
  process.on('SIGINT', gracefulShutdown.bind(null, { exit: true }));
  process.on('SIGTERM', gracefulShutdown.bind(null, { exit: true }));
  process.on('uncaughtException', gracefulShutdown.bind(null, { exit: true }));
}
